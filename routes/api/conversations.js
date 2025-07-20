const express = require('express');
const router = express.Router();
const { Conversation, Listing, User } = require('../../models');
const { Op } = require('sequelize');

//conversations for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: req.params.userId },
          { user2Id: req.params.userId }
        ]
      },
      include: [
        { model: Listing, attributes: ['title', 'id'] },
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] }
      ]
    });

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//specific conversation and its messages
router.get('/:conversationId', async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.conversationId, {
      include: [
        { model: Listing, attributes: ['title', 'id'] },
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;