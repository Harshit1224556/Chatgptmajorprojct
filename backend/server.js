const app = require('./src/app')
const initSocketServer = require('./src/sockets/socket.server')
const httpserver = require('http').createServer(app)
const connecttoDb = require('./src/db/db')
const startKeepAlive = require('./src/cron/keepAlive')

initSocketServer(httpserver)
connecttoDb()

const PORT = process.env.PORT || 3000

httpserver.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
    startKeepAlive()
})