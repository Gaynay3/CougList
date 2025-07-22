const express = require('express'); 
const router = express.Router();
const { Conversation, Message, Listing, User } = require('../../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/login'); // or handle unauthenticated access
    }

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        { model: Listing },
        { model: User, as: 'user1' },
        { model: User, as: 'user2' },
        {
          model: Message,
          separate: true,
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3 
    });

    const enhancedConversations = conversations.map(conv => {
      const convJson = conv.toJSON();
      const otherUser = (convJson.user1Id === userId)
        ? convJson.user2
        : convJson.user1;

      return {
        ...convJson,
        otherUser
      };
    });

    res.render('dashboard', { conversations: enhancedConversations });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Dashboard error');
  }
});

module.exports = router;
