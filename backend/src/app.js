require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const authRouters = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouters)
app.use('/api/chat', chatRoutes)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
}



module.exports = app

