import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

// Create socket connection
const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const ChatGPTClone = () => {
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- LOAD CHATS ----------------
  const loadChats = async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      credentials: "include",
    });
    const data = await res.json();
    setChats(data);
    return data;
  };

  // ---------------- LOAD MESSAGES ----------------
  const loadMessages = async (id) => {
    const res = await fetch(
      `${BASE_URL}/api/chat/${id}/messages`,
      { credentials: "include" }
    );

    const data = await res.json();
    const msgs = data.messages || data;

    setMessages(
      msgs.map((m) => ({
        id: m._id,
        role: m.role === "model" ? "assistant" : m.role,
        content: m.content,
      }))
    );
  };

  const openChat = (id) => {
    if (!id) return;
    localStorage.setItem("activeChatId", id);
    setChatId(id);
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    const init = async () => {
      const allChats = await loadChats();
      const saved = localStorage.getItem("activeChatId");

      if (saved) {
        setChatId(saved);
      } else if (allChats.length > 0) {
        setChatId(allChats[0]._id);
      } else {
        const res = await fetch(`${BASE_URL}/api/chat`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New Chat" }),
        });

        const data = await res.json();
        setChatId(data.chat._id);
        localStorage.setItem("activeChatId", data.chat._id);
      }
    };

    init();
  }, []);

  // ---------------- WHEN CHAT CHANGES ----------------
  useEffect(() => {
    if (!chatId) return;

    socket.emit("join-chat", chatId);
    loadMessages(chatId);
  }, [chatId]);

  // ---------------- SOCKET LISTENER ----------------
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg._id)) return prev;

        return [
          ...prev,
          { id: msg._id, role: "assistant", content: msg.content },
        ];
      });
    };

    socket.on("ai-response", handler);
    return () => socket.off("ai-response", handler);
  }, []);

  // ---------------- CREATE NEW CHAT ----------------
  const createNewChat = async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });

    const data = await res.json();
    await loadChats();
    openChat(data.chat._id);
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSend = () => {
    if (!input.trim() || !chatId) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: userMessage },
    ]);

    setInput("");

    socket.emit("ai-message", {
      chat: chatId,
      content: userMessage,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-3 border-r border-gray-700 overflow-y-auto">
        <button
          onClick={createNewChat}
          className="w-full mb-3 bg-green-600 p-2 rounded"
        >
          + New Chat
        </button>

        {chats.map((c) => (
          <div
            key={c._id}
            onClick={() => openChat(c._id)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              chatId === c._id ? "bg-gray-600" : "bg-gray-700"
            }`}
          >
            {c.title || "Untitled Chat"}
          </div>
        ))}
      </div>

      {/* Main Chat */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user" ? "text-right mb-2" : "text-left mb-2"
              }
            >
              <span className="inline-block px-4 py-2 rounded bg-gray-700">
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-4 bg-gray-800 flex">
          <input
            className="flex-1 p-2 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ml-2 bg-blue-600 px-4" onClick={handleSend}>
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatGPTClone;