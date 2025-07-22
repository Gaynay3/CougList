const express = require('express');
const router = express.Router();
const { Conversation, Message, User, Listing } = require('../../models');
const { Op } = require('sequelize');

// GET /inbox - Show all conversations with latest message
router.get('/', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login.html');

  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        { model: Listing },
        { model: User, as: 'user1', attributes: ['id', 'email'] },
        { model: User, as: 'user2', attributes: ['id', 'email'] },
        {
          model: Message,
          separate: true,
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.render('inbox', {
      conversations,
      selectedConversation: null,
      currentUserId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading inbox');
  }
});

// GET /inbox/:id - Open a specific conversation thread
router.get('/:id', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login.html');

  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        { model: Listing },
        { model: User, as: 'user1', attributes: ['id', 'email'] },
        { model: User, as: 'user2', attributes: ['id', 'email'] },
        {
          model: Message,
          separate: true,
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const selectedConversation = conversations.find(c => c.id === parseInt(req.params.id));
    if (!selectedConversation) return res.status(404).send('Conversation not found');

    res.render('inbox', {
      conversations,
      selectedConversation,
      currentUserId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading conversation');
  }
});

// POST /inbox/:id/message - Send new message
router.post('/:id/message', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login.html');

  try {
    const { content } = req.body;
    if (!content) return res.status(400).send('Message content required');

    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).send('Conversation not found');

    await Message.create({
      conversationId: conversation.id,
      senderId: userId,
      content
    });

    res.redirect(`/inbox/${conversation.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message');
  }
});

// POST /inbox/start-conversation - Start a new conversation
router.post('/start-conversation', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login.html');

  const { listingId, sellerId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      where: {
        user1Id: userId,
        user2Id: sellerId,
        listingId
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: userId,
        user2Id: sellerId,
        listingId
      });
    }

    res.redirect(`/inbox/${conversation.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not start conversation");
  }
});

module.exports = router;
