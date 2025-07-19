const express = require('express');
const router = express.Router();
const { Message, Conversation } = require('../../models');

// obtain all messages in a conversation
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { conversationId: req.params.conversationId },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

//new messages
router.post('/', async (req, res) => {
  const { user1Id, user2Id, listingId, senderId, content } = req.body;

  if (!user1Id || !user2Id || !listingId || !senderId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let convo = await Conversation.findOne({
      where: { user1Id, user2Id, listingId }
    });

    if (!convo) {
      convo = await Conversation.create({ user1Id, user2Id, listingId });
    }

    const message = await Message.create({
      conversationId: convo.id,
      senderId,
      content
    });

    res.status(201).json({ conversationId: convo.id, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
