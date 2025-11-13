import React, { useState } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text) return;
    const message = { username: "User", text };

    try {
      // 1️⃣ Backend'e kaydet
      const saved = await axios.post("https://render-backend-url/messages", message);

      // 2️⃣ AI servise gönder
      const sentimentResp = await axios.post("https://huggingface-space-url", { text });
      const sentiment = sentimentResp.data;

      setMessages([...messages, { ...saved.data, sentiment }]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ border: "1px solid black", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b>{msg.username}:</b> {msg.text} 
            <i> ({msg.sentiment ? msg.sentiment[0] : "analiz yok"})</i>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "80%", padding: "5px", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: "5px" }}>Gönder</button>
    </div>
  );
}
