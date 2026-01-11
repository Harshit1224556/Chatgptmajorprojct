require('dotenv').config()
const express = require('express')
const Cookieparser = require('cookie-parser')
const authRouters = require('./routes/auth.routes')
const app = express()
app.use(express.json())
app.use(Cookieparser())
app.use('/api/auth',authRouters)
module.exports = app