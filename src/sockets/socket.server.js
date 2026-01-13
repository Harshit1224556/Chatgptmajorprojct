const {Server} = require('socket.io')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const userModel = require('../models/user.model')
const aiservice = require('../services/ai.services')
const messageModel = require('../models/message.model.js')
const jwt = require('jsonwebtoken')
function initSocketServer(httpserver){
    const io = new Server(httpserver,{})
    io.use( async (socket,next)=>{
        const cookies = cookie.parse(socket.handshake.headers?.cookie||"")
        if(!cookies.token){
            next(new Error("Authensiation no cookie provided"))
        }

        try{
            const decoded = jwt.verify(cookies.token,process.env.JWTSECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        }
        catch(err){
            next(new Error("Invalid Token"))
        }
        
    })

 io.on("connection", (socket) => {
  socket.on("ai-message", async (messagepayload) => {
    try {
      if (typeof messagepayload === "string") {
        messagepayload = JSON.parse(messagepayload);
      }

      const { chat, content } = messagepayload || {};

      if (!chat || !content) {
        console.log("Invalid payload:", messagepayload);
        return;
      }
        
     
      await messageModel.create({
        chat,
        user: socket.user._id,
        content,
        role: "user",
      });
       const chathistory = await messageModel.find({
         chat:messagepayload.chat 
      })
      console.log(chathistory)
      const response = await aiservice.generateResponse(content);

      await messageModel.create({
        chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      socket.emit("ai-response", { chat, content: response });
    } catch (err) {
      console.error("Socket AI Error:", err.message);
    }
  });
});
}
module.exports = initSocketServer