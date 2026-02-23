const messageModel = require("../models/message.model");

async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({messages});
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
}

module.exports = { getMessages };
