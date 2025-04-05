import { useState, useEffect, useRef } from "react";
import { db, auth } from "../../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { realtimeDb } from "../../../firebase/firebase";
import { ref, set, onValue } from "firebase/database";
import PageHeader from "../../common/page-header/page-header";
import NoSelectedUser from "../../common/no-selected-user/no-selected-user";
import "./chatRoom.scss";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import UserList from "../../common/users/users";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import GlobalModal from "../../common/global-modal/globalModal";
import useMediaQuery from "../../../hooks/useMediaQuery";
import TypingAnimation from "../../common/typing-animation/typing-animation";

const ChatRoom = () => {
  interface Message {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    createdAt: any;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [allUserStatuses, setAllUserStatuses] = useState<
    Record<string, boolean>
  >({});
  const selectedUserId = useSelector(
    (state: RootState) => state.setSelectedUserData.userId
  );
  const selectedUserName = useSelector(
    (state: RootState) => state.setSelectedUserData.userName
  );
  const [isFriendsListModalOpen, setIsFriendsListModalOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const { isDesktop, isMobile } = useMediaQuery();

  // PRACENJE STATUSA KORISNIKA DA LI JE ONLINE ILI OFFLINE

  useEffect(() => {
    const statusRef = ref(realtimeDb, "/status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const statuses = snapshot.val();

      if (!statuses) return;

      const statusMap: Record<string, boolean> = {};

      Object.entries(statuses).forEach(([uid, statusData]: any) => {
        statusMap[uid] = statusData.state === "connected";
      });

      setAllUserStatuses(statusMap);
    });

    return () => unsubscribe();
  }, []);

  // HOOK FOR FETCHING MESSAGES FROM DATABASE
  useEffect(() => {
    if (!selectedUserId) return;

    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          senderId: doc.data().senderId,
          receiverId: doc.data().receiverId,
          createdAt: doc.data().createdAt,
        }))
        .filter(
          (message) =>
            (message.senderId === auth?.currentUser?.uid &&
              message.receiverId === selectedUserId) ||
            (message.senderId === selectedUserId &&
              message.receiverId === auth?.currentUser?.uid)
        );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  // FUNCTION FOR SENDING MESSAGES

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUserId) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: auth?.currentUser?.uid,
        receiverId: selectedUserId,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // FUNCTION FOR OPEN AND CLOSING MODAL FOR FRIENDS LIST START

  const handleOpenFriendsListModal = () => {
    {
      setIsFriendsListModalOpen(true);
    }
  };

  //  SMOOTH SCROLL TO BOTTOM OF MESSAGES WHEN NEW MESSAGE IS SENT OR ARRIVED
  const messagesWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesWrapperRef.current) {
      messagesWrapperRef.current.scrollTo({
        top: messagesWrapperRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //FUNCTION FOR UPDATING STATUS WHEN USER START TYPING

  //funkcija koja azurira status kucanja korisnika u realtime database
  const updateTypingStatus = (userId: string, isTyping: boolean) => {
    set(ref(realtimeDb, `users/${userId}/isTyping`), isTyping);
  };

  useEffect(() => {
    if (!selectedUserId) return;

    /**pracenje  statusa kucanja od strane selektovanog korisnika,
     *  korisnik ce videti animaciju kuckanja kada korisnik sa kojim se dopisuje krene da kuca a ne dok on sam kuca,
     * zato sto sam uzeo referencu na status kucanja selektovanog korisnika sa kime se dopisujem i ako se njegov status menja prikazace se animacija  */
    const typingRef = ref(realtimeDb, `users/${selectedUserId}/isTyping`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      const isTyping = snapshot.val();
      if (isTyping) {
        setIsUserTyping(true);
      } else {
        setIsUserTyping(false);
      }
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  // Funkcija koja se poziva kada korisnik počne da kuca
  const handleTyping = () => {
    if (selectedUserId) {
      if (auth?.currentUser?.uid) {
        updateTypingStatus(auth.currentUser.uid, true); // azurira realtime db na true
      }
    }
  };

  // Funkcija koja se poziva kada korisnik prestane da kuca
  const handleStopTyping = () => {
    if (selectedUserId) {
      if (auth?.currentUser?.uid) {
        updateTypingStatus(auth.currentUser.uid, false); // azurira realtime db na false
      }
    }
  };

  // useEffect se pokrece kada se promeni vrednost newMessage tj kada krene korisnik da kuca , ako se vrednost ne promeni 1.5 sekunde pokrece se funkcija handleStopTyping.
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      handleStopTyping();
    }, 1500);

    return () => clearTimeout(typingTimer);
  }, [newMessage]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  return (
    <div className="chat-room-container">
      {isDesktop && (
        <PageHeader
          title="Chat Room"
          fontColor="white"
          backgroundColor="#2e1b3e"
        />
      )}

      <div className="mainWrapper">
        {isMobile && (
          <button
            className="chooseFriendButton"
            onClick={() => {
              handleOpenFriendsListModal();
            }}
          >
            Friends
          </button>
        )}

        {isDesktop && (
          <div className="users-wrapper">
            <UserList></UserList>
          </div>
        )}

        {selectedUserId ? (
          <div className="allChat">
            <div className="receiverDataBar">
              <h3>{selectedUserName}</h3>
              <span
                style={{
                  backgroundColor: allUserStatuses[selectedUserId]
                    ? "green"
                    : "red",
                }}
              ></span>
            </div>
            <div className="messages-wrapper" ref={messagesWrapperRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    backgroundColor:
                      message.senderId === auth?.currentUser?.uid
                        ? "#dcf8c6"
                        : "#2e1b3e",
                    padding: "8px",
                    borderRadius: "10px",

                    alignSelf:
                      message.senderId === auth?.currentUser?.uid
                        ? "flex-end"
                        : "flex-start",
                    maxWidth: "220px",
                    wordWrap: "break-word",
                  }}
                >
                  <span
                    style={{
                      color:
                        message.senderId === auth?.currentUser?.uid
                          ? "black"
                          : "white",
                      wordWrap: "break-word",
                    }}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="typing-idicator-wrapper">
              {isUserTyping && <TypingAnimation />}
            </div>
            <div className="input-wrapper">
              <Input
                className="sendMessageInput"
                type="text"
                value={newMessage}
                onChange={(e) => {
                  handleMessageChange(e);
                }}
                placeholder="Type a message..."
              />

              <Button
                type="primary"
                shape="round"
                icon={<SendOutlined />}
                size={"large"}
                style={{ backgroundColor: "#2e1b3e" }}
                onClick={sendMessage}
              />
            </div>
          </div>
        ) : (
          <NoSelectedUser></NoSelectedUser>
        )}

        <GlobalModal
          handleCancel={() => {
            setIsFriendsListModalOpen(false);
          }}
          title="All friends"
          isModalOpen={isFriendsListModalOpen}
        >
          <UserList
            onCloseModal={() => setIsFriendsListModalOpen(false)}
          ></UserList>
        </GlobalModal>
      </div>
    </div>
  );
};

export default ChatRoom;
