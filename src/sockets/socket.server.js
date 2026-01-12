const {Server} = require('socket.io')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const userModel = require('../models/user.model')
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

    io.on("connection",(socket)=>{
        socket.on("ai-message",async (messagepayload)=>{
            console.log(messagepayload)
        })
    })
}
module.exports =initSocketServer
