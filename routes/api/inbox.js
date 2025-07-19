const express = require('express');
const router = express.Router();
const { Conversation, Message, User, Listing} = require('../../models');
const { Op } = require('sequelize');

// will replace with authorization session logic)
const mockCurrentUser = {
  id: 1,
  username: 'Andrea Luquin'
};

// GET show all conversations with latest message
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: mockCurrentUser.id },
          { user2Id: mockCurrentUser.id }
        ]
      },
      include: [
        { model: Listing },
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] },
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
      currentUser: mockCurrentUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading inbox');
  }
});

// open a specific conversation thread
router.get('/:id', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: mockCurrentUser.id },
          { user2Id: mockCurrentUser.id }
        ]
      },
      include: [
        { model: Listing },
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] },
        {
          model: Message,
          separate: true,
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const selectedConversation = conversations.find(c => c.id === parseInt(req.params.id));

    if (!selectedConversation) {
      return res.status(404).send('Conversation not found');
    }

    res.render('inbox', {
      conversations,
      selectedConversation,
      currentUser: mockCurrentUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading conversation');
  }
});

//  send new message
router.post('/:id/message', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).send('Message content required');

    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).send('Conversation not found');

    await Message.create({
      conversationId: conversation.id,
      senderId: mockCurrentUser.id,
      content
    });

    res.redirect(`/inbox/${conversation.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message');
  }

});



module.exports = router;
