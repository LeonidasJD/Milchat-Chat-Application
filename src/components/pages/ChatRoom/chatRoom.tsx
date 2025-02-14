import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const ChatRoom = () => {
  interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: any;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // HOOK FOR FETCHING MESSAGES FROM DATABASE
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        createdAt: doc.data().createdAt,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // FUNCTION FOR SENDING MESSAGES

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: auth?.currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              margin: "10px 0",
              textAlign:
                msg.senderId === auth?.currentUser?.uid ? "right" : "left",
            }}
          >
            <span
              style={{
                backgroundColor:
                  msg.senderId === auth?.currentUser?.uid
                    ? "#dcf8c6"
                    : "#f1f1f1",
                padding: "8px",
                borderRadius: "10px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "10px", marginTop: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{ width: "18%", padding: "10px", marginLeft: "5px" }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
