const {Server} = require('socket.io')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const userModel = require('../models/user.model')
const aiservice = require('../services/ai.services')
const messageModel = require('../models/message.model.js')
const jwt = require('jsonwebtoken')
const {creatememory, querymemory} = require('../services/vector.service.js')
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
        content:content,
        role: "user",
      });
       const chathistory = (await messageModel.find({
         chat:messagepayload.chat 
      }).sort({createdAt:-1}).limit(20).lean()).reverse()
     
 
      const response = await aiservice.generateResponse(chathistory.map(item=>{
          return {
            role:item.role,
            parts:[{text:item.content}]

          }
      }));

    

       const vector = await aiservice.generatevector(messagepayload.content)
       console.log("vector: ",vector);

      

      const responsemessage = await messageModel.create({
        chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });


       const memory = await querymemory({
  queryvector: vector,
  limit: 3,
  metadata: {
    user: socket.user._id.toString(),
    chat: chat.toString()
  }
});


       console.log(memory)
      await creatememory({vector,
        messageId:responsemessage._id,
        metadata:{
          chat:messagepayload.chat,
          user:socket.user._id,
          text:response
        }
      })

      socket.emit("ai-response", { chat, content: response });
    } catch (err) {
      console.error("Socket AI Error:", err.message);
    }
  });
});
}
module.exports = initSocketServer