const express = require('express');
const { deleteChat } = require("../controller/delete.controller");

const Authmiddleware = require('../middleware/auth.middleware');
const chatcontroller = require('../controller/chat.controller');
const messageController = require("../controller/message.controller");
const { getUserChats } = require("../controller/getchart.controller");

const router = express.Router();


router.post("/", Authmiddleware.authUser, chatcontroller.createchat);


router.get("/", Authmiddleware.authUser, getUserChats);

router.get("/:chatId/messages", Authmiddleware.authUser, messageController.getMessages);
router.delete("/:id", Authmiddleware.authUser, deleteChat);


module.exports = router;
