const Chat = require('../models/chat.model');

const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ success: true, message: "Chat deleted" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete chat" });
  }
};

module.exports = {deleteChat};
