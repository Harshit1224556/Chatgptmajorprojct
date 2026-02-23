import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChatId: null,
    isSending: false,
    input: ''
  },

  reducers: {

    startNewChat(state, action) {
      const { _id, title } = action.payload;
      state.chats.unshift({ _id, title: title || 'New Chat', messages: [] });
      state.activeChatId = _id;
    },

    selectChat(state, action) {
      state.activeChatId = action.payload;
    },

    setInput(state, action) {
      state.input = action.payload;
    },

    sendingStarted(state) {
      state.isSending = true;
    },

    sendingFinished(state) {
      state.isSending = false;
    },

    setChats(state, action) {
      state.chats = action.payload.map(chat => ({
        ...chat,
        messages: chat.messages || []
      }));
    },

    setMessages: {
      reducer(state, action) {
        const { chatId, messages } = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (chat) {
          chat.messages = messages;
        }
      },
      prepare(chatId, messages) {
        return { payload: { chatId, messages } };
      }
    },

    addUserMessage: {
      reducer(state, action) {
        const { chatId, message } = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (!chat) return;

        if (chat.messages.length === 0) {
          chat.title =
            message.content.slice(0, 40) +
            (message.content.length > 40 ? '…' : '');
        }

        chat.messages.push(message);
      },
      prepare(chatId, content) {
        return {
          payload: {
            chatId,
            message: { role: 'user', content, ts: Date.now() }
          }
        };
      }
    },

    addAIMessage: {
      reducer(state, action) {
        const { chatId, message } = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (!chat) return;
        chat.messages.push(message);
      },
      prepare(chatId, content, error = false) {
        return {
          payload: {
            chatId,
            message: {
              role: 'ai',
              content,
              ts: Date.now(),
              ...(error ? { error: true } : {})
            }
          }
        };
      }
    },

    // ⭐ DELETE CHAT FEATURE
    deleteChatLocal(state, action) {
  const id = action.payload;

  const index = state.chats.findIndex(c => c._id === id);
  if (index === -1) return;

  state.chats.splice(index, 1);

  // if deleted chat was active
  if (state.activeChatId === id) {

    // choose next chat
    if (state.chats[index]) {
      state.activeChatId = state.chats[index]._id;
    }
    else if (state.chats[index - 1]) {
      state.activeChatId = state.chats[index - 1]._id;
    }
    else {
      state.activeChatId = null;
    }
  }
}

  }
});

export const {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  setChats,
  setMessages,
  deleteChatLocal
} = chatSlice.actions;

export default chatSlice.reducer;
