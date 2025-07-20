const express = require('express');
const router = express.Router();
const { Conversation, Message, Listing, User } = require('../../models');

const mockCurrentUser = {
  id: 1,
  username: 'Andrea Luquin'
};

router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { user1Id: mockCurrentUser.id },
          { user2Id: mockCurrentUser.id }
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

    res.render('dashboard', { conversations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Dashboard error');
  }
});

module.exports = router;