import React, { useEffect, useState, useCallback } from 'react';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api.js';
import { toast } from "react-toastify";
import Modal from "../components/ui/Modal";

import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats,
  addUserMessage,
  addAIMessage,
  setMessages,
  deleteChatLocal
} from '../store/chatSlice.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

const Home = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chats = useSelector(state => state.chat?.chats) || [];
  const activeChatId = useSelector(state => state.chat?.activeChatId);
  const input = useSelector(state => state.chat?.input);
  const isSending = useSelector(state => state.chat?.isSending);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW CHAT MODAL
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // DELETE MODAL
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
  }, [navigate]);

  // ---------------- GET MESSAGES ----------------
  const getMessages = useCallback(async (chatId) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      const messages = (response.data.messages || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'ai',
        content: m.content,
        ts: m.createdAt ? new Date(m.createdAt).getTime() : Date.now()
      }));
      dispatch(setMessages(chatId, messages));
    } catch (err) {
      console.error("Failed loading messages:", err);
    }
  }, [dispatch]);

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      const response = await api.get('/chat');
      const loadedChats = Array.isArray(response.data) ? [...response.data].reverse() : [];

      dispatch(setChats(loadedChats));

      if (loadedChats.length > 0) {
        const firstId = loadedChats[0]._id;
        dispatch(selectChat(firstId));
        await getMessages(firstId);
      }

      setLoading(false);
    };

    loadChats();

    const tempSocket = io(SOCKET_URL, { withCredentials: true, path: '/socket.io' });

    tempSocket.on("ai-response", (payload) => {
      if (payload?.chat) dispatch(addAIMessage(payload.chat, payload.content));
      dispatch(sendingFinished());
    });

    setSocket(tempSocket);
    return () => tempSocket.disconnect();

  }, [dispatch, navigate, getMessages]);

  // ---------------- CREATE CHAT ----------------
  const createChat = async () => {
    if (!newTitle.trim()) return;

    const res = await toast.promise(
      api.post("/chat", { title: newTitle }),
      { pending:"Creating chat...", success:"Chat created 🎉", error:"Failed ❌" }
    );

    dispatch(startNewChat(res.data.chat));
    await getMessages(res.data.chat._id);

    setShowNewChatModal(false);
    setNewTitle("");
    setSidebarOpen(false);
  };

  // ---------------- DELETE CHAT ----------------
  const confirmDelete = async () => {
  if (!deleteId) return;

  try {
    await api.delete(`/chat/${deleteId}`);

    dispatch(deleteChatLocal(deleteId));

    // get new active chat AFTER redux update
    const updatedChats = chats.filter(c => c._id !== deleteId);

    if (updatedChats.length > 0) {
      const nextId = updatedChats[0]._id;
      dispatch(selectChat(nextId));
      await getMessages(nextId);
    }

    toast.success("Chat deleted");
    setDeleteId(null);

  } catch (err) {
    toast.error("Delete failed");
  }
};


  // ---------------- SEND MESSAGE ----------------
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;

    dispatch(sendingStarted());
    dispatch(addUserMessage(activeChatId, trimmed));
    dispatch(setInput(''));

    socket?.emit("ai-message", { chat: activeChatId, content: trimmed });
  };

  const activeChat = chats.find(c => c._id === activeChatId);
  const messages = activeChat?.messages || [];

  if (loading) return <p style={{textAlign:'center'}}>Loading chats...</p>;

  return (
    <div className="chat-layout minimal">

      <ChatMobileBar onToggleSidebar={() => setSidebarOpen(o => !o)} onNewChat={() => setShowNewChatModal(true)} />

     <ChatSidebar
  chats={chats}
  activeChatId={activeChatId}
  onSelectChat={(id) => dispatch(selectChat(id))}
  onNewChat={() => setShowNewChatModal(true)}
  onDeleteChat={(id) => setDeleteId(id)}   
  open={sidebarOpen}
/>

      <main className="chat-main">
        <ChatMessages messages={messages} isSending={isSending}/>
        {activeChatId && <ChatComposer input={input} setInput={(v)=>dispatch(setInput(v))} onSend={sendMessage} isSending={isSending}/>}
      </main>

      {/* CREATE CHAT MODAL */}
      <Modal open={showNewChatModal} title="Create New Chat" onClose={()=>setShowNewChatModal(false)}>
        <input className="modal-input" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Enter chat title"/>
        <div style={{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"15px"}}>
          <button onClick={()=>setShowNewChatModal(false)}>Cancel</button>
          <button onClick={createChat}>Create</button>
        </div>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal open={!!deleteId} title="Delete Chat?" onClose={()=>setDeleteId(null)}>
        <p>This action cannot be undone.</p>
        <div style={{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"15px"}}>
          <button onClick={()=>setDeleteId(null)}>Cancel</button>
          <button style={{background:"#ef4444",color:"white"}} onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>

    </div>
  );
};

export default Home;
