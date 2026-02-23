const chatModel = require("../models/chat.model");

async function getUserChats(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chats" });
  }
}

module.exports = { getUserChats };
