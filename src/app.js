require('dotenv').config()
const express = require('express')
const Cookieparser = require('cookie-parser')
const app = express()
app.use(express.json())
app.use(Cookieparser())
module.exports = app