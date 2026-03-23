require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const authRouters = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')
const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://y-nqukhwea1-iamharshitsharma518-5075s-projects.vercel.app'
  ],
  credentials: true
}));
app.options("*", cors());
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouters)
app.use('/api/chat', chatRoutes)
module.exports = app

