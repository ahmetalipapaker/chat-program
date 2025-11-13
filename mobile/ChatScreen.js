import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";

// Backend ve AI servis URL'leri
const backendURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/messages"
    : "http://localhost:5000/messages";

const aiURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:7860/analyze"
    : "http://localhost:7860/analyze";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Misafir 1");

  // Mesajları çek
  const fetchMessages = async () => {
    try {
      const res = await fetch(backendURL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Mesajları çekerken hata:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mesaj gönder
  const handleSend = async () => {
    if (!input.trim()) return;

    // AI ile duygu analizi
    let sentiment = "Unknown";
    let sentimentScore = 0;
    try {
      const res = await fetch(aiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      sentiment = data.label;
      sentimentScore = data.score;
    } catch (err) {
      console.error("AI analizi hatası:", err);
    }

    const newMessage = {
      username,
      text: input,
      sentiment,
      sentimentScore,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setInput("");
    } catch (err) {
      console.error("Mesaj gönderme hatası:", err);
    }
  };

  // Mesaj balonlarının stili
  const getBubbleStyle = (msg) => {
    const bgColor =
      msg.sentiment === "POSITIVE" ? "#d4edda" :
      msg.sentiment === "NEGATIVE" ? "#f8d7da" :
      "#fff3cd";

    const align = msg.username === username ? "flex-end" : "flex-start";

    return { backgroundColor: bgColor, alignSelf: align, borderRadius: 15, padding: 10, marginBottom: 8, maxWidth: "80%" };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MooD Chat AI</Text>
      <Text style={styles.subheader}>Duygu Analizi AI ile Sohbete Başla</Text>

      <FlatList
        style={styles.chatContainer}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={getBubbleStyle(item)}>
            <Text style={styles.username}>{item.username}:</Text>
            <Text>{item.text}</Text>
            <Text style={styles.sentiment}>
              {item.sentiment} ({item.sentimentScore.toFixed(2)})
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Mesaj yaz..."
          style={styles.input}
        />
        <Button title="Gönder" onPress={handleSend} color="green" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cce7ff", // Bebek mavisi arka plan
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fffaf0", // Krem chat ekranı
    padding: 10,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  username: { fontWeight: "bold" },
  sentiment: { fontSize: 12, color: "#555", marginTop: 2 },
  timestamp: { fontSize: 10, color: "#999", marginTop: 2 },
});
