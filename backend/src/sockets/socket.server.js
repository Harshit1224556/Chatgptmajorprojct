const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model.js");
const messageModel = require("../models/message.model.js");

const aiservice = require("../services/ai.services.js");
const { creatememory, querymemory } = require("../services/vector.service.js");

function buildMemoryContext(matches) {
if (!matches || matches.length === 0) return "";

let context = "PAST USER FACTS:\n";
for (const m of matches) {
if (m.metadata?.text) context += "- " + m.metadata.text + "\n";
}
return context;
}

function initSocketServer(httpserver) {

const io = new Server(httpserver, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-frontend-name.onrender.com"
    ],
    credentials: true
  }
});

// AUTH
io.use(async (socket, next) => {
try {
const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
if (!cookies.token) return next(new Error("No token"));


  const decoded = jwt.verify(cookies.token, process.env.JWTSECRET);
  const user = await userModel.findById(decoded.id);

  socket.user = user;
  next();
} catch {
  next(new Error("Invalid Token"));
}


});

io.on("connection", (socket) => {

// ⭐ JOIN CHAT ROOM
socket.on("join-chat", (chatId) => {
  socket.join(chatId);
  console.log("User joined chat:", chatId);
});

socket.on("ai-message", async (messagepayload) => {
  try {

    if (typeof messagepayload === "string")
      messagepayload = JSON.parse(messagepayload);

    const { chat, content } = messagepayload || {};
    if (!chat || !content) return;

    // SAVE USER MESSAGE
    const userMessage = await messageModel.create({
      chat,
      user: socket.user._id,
      content,
      role: "user",
    });

    // send user message to all clients in chat
    io.to(chat).emit("message-added", userMessage);

    // VECTOR
    const vector = await aiservice.generatevector(content);

    // MEMORY SEARCH
    const memoryMatches = await querymemory({
      queryvector: vector,
      limit: 5,
      metadata: { user: socket.user._id.toString() },
    });

    const memoryContext = buildMemoryContext(memoryMatches);

    // CHAT HISTORY
    const chathistory = (
      await messageModel.find({ chat }).sort({ createdAt: -1 }).limit(20).lean()
    ).reverse();

    const historyText = chathistory
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const finalPrompt = `


You are a helpful AI assistant with memory.

${memoryContext}

RECENT CONVERSATION:
${historyText}

USER:
${content}
`;

    // AI RESPONSE
    const response = await aiservice.generateResponse(finalPrompt);
   
   
    const aiMessage = await messageModel.create({
      chat,
      user: socket.user._id,
      content: response,
      role: "model",
    });

    // STORE MEMORY
    await creatememory({
      vector,
      messageId: aiMessage._id.toString(),
      metadata: {
        user: socket.user._id.toString(),
        text: content,
      },
    });

  
socket.emit("ai-response", aiMessage);
  } catch (err) {
    console.error("Socket AI Error:", err);
  }
});

});
}

module.exports = initSocketServer
