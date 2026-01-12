const express = require('express')
const Authmiddleware = require('../middleware/auth.middleware')
const chatcontroller = require('../controller/chat.controller')
const router = express.Router()
router.post("/",Authmiddleware.authUser,chatcontroller.createchat)
module.exports = router