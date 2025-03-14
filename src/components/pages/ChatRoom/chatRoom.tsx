import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import PageHeader from "../../common/page-header/page-header";
import NoSelectedUser from "../../common/no-selected-user/no-selected-user";
import "./chatRoom.scss";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import UserList from "../../common/users/users";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import GlobalModal from "../../common/global-modal/globalModal";

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
  const [userIsOnline, setUserIsOnline] = useState<boolean>(false);
  const selectedUserId = useSelector(
    (state: RootState) => state.setSelectedUserData.userId
  );
  const selectedUserName = useSelector(
    (state: RootState) => state.setSelectedUserData.userName
  );

  // PRACENJE STATUSA KORISNIKA DA LI JE ONLINE ILI OFFLINE

  useEffect(() => {
    if (!selectedUserId) return;

    const useRef = doc(db, "users", selectedUserId);

    const unsubscribe = onSnapshot(useRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        // user is online
        const userData = docSnapshot.data();
        if (userData.isOnline && userData.isOnline !== undefined) {
          setUserIsOnline(true);
        } else {
          // user is offline
          setUserIsOnline(false);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedUserId]);

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

  return (
    <div className="chat-room-container">
      <PageHeader
        title="Chat Room"
        fontColor="white"
        backgroundColor="#2e1b3e"
      />
      <div className="mainWrapper">
        <div className="users-wrapper">
          <UserList></UserList>
        </div>
        {selectedUserId ? (
          <div className="allChat">
            <div className="receiverDataBar">
              <h3>{selectedUserName}</h3>
              <span
                style={{ backgroundColor: userIsOnline ? "green" : "red" }}
              ></span>
            </div>
            <div className="messages-wrapper">
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    margin: "10px 0",
                    textAlign:
                      message.senderId === auth?.currentUser?.uid
                        ? "right"
                        : "left",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        message.senderId === auth?.currentUser?.uid
                          ? "#dcf8c6"
                          : "#2e1b3e",
                      padding: "8px",
                      borderRadius: "10px",
                      color:
                        message.senderId === auth?.currentUser?.uid
                          ? "black"
                          : "white",
                    }}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
              <div className="input-wrapper">
                <Input
                  className="sendMessageInput"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />

                <Button
                  type="primary"
                  shape="round"
                  icon={<SendOutlined />}
                  size={"large"}
                  style={{ backgroundColor: "#2e1b3e", marginTop: "15px" }}
                  onClick={sendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <NoSelectedUser></NoSelectedUser>
        )}

        <GlobalModal handleCancel={() => {}} title="Users" isModalOpen={false}>
          <div className="users-wrapper">
            <UserList></UserList>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
};

export default ChatRoom;
