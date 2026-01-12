const app = require('./src/app')
const initSocketServer = require('./src/sockets/socket.server')

const httpserver = require('http').createServer(app)
const connecttoDb = require('./src/db/db')
initSocketServer(httpserver)
connecttoDb()
httpserver.listen(3000,()=>{
    console.log("Server is running at the port 3000")
})