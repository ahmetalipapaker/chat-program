import React, { useState, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Misafir 1");

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { username, text: input };
    try {
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data]);
      setInput("");
    } catch (err) { console.error(err); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSend(); };

  const getBubbleStyle = (msg) => {
    const label = msg.sentiment.toLowerCase(); // normalize et
    const bgColor = label === "positive" ? "#d4edda"
                   : label === "negative" ? "#f8d7da"
                   : "#fff3cd";
    const align = msg.username === username ? "flex-end" : "flex-start";
    return { backgroundColor: bgColor, alignSelf: align, borderRadius: 15, padding: 10, marginBottom: 8, maxWidth: "80%" };
};


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#cce7ff", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 600, fontFamily: "Arial", backgroundColor: "#fffaf0", padding: 20, borderRadius: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", color: "#333" }}>MooD Chat AI</h1>
        <h3 style={{ textAlign: "center", color: "#555", marginTop: -5 }}>Duygu Analizi AI ile Sohbete Başla</h3>

        <select value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: 10, padding: 5 }}>
          <option>Misafir 1</option>
          <option>Misafir 2</option>
        </select>

        <div style={{ border: "1px solid #ccc", padding: 10, height: 400, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: 10 }}>
          {messages.length === 0 ? <p>Henüz mesaj yok.</p> :
            messages.map(msg => (
              <div key={msg.id} style={getBubbleStyle(msg)}>
                <strong>{msg.username}: </strong>
                <span>{msg.text}</span>
                <div style={{ fontSize: "0.7em", color: "#555", marginTop: 4 }}>
                  {msg.sentiment} ({msg.sentimentScore.toFixed(2)})
                </div>
                <div style={{ fontSize: "0.7em", color: "#999", marginTop: 2 }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          }
        </div>

        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesaj yaz..."
            style={{ flex: 1, padding: 8, borderRadius: 20, border: "1px solid #ccc" }}
          />
          <button onClick={handleSend} style={{ marginLeft: 10, borderRadius: 20, backgroundColor: "#28a745", color: "#fff", border: "none", padding: "8px 16px" }}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
