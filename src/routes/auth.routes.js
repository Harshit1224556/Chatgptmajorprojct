const express = require('express')
const authContoller = require('../controller/auth.controller')
const router = express.Router()
router.post("/register",authContoller.register)
router.post("/login",authContoller.login)
module.exports=router