const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = require('./user');
const Message = require('./messages');
const Conversation = require('./conversations');
const Listing = require('./listings');

// Associations
Conversation.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Conversation.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });
Conversation.hasMany(Message, {foreignKey: 'conversationId',onDelete: 'CASCADE' });

Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

Listing.hasMany(Conversation, { foreignKey: 'listingId' });
Listing.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
Conversation.belongsTo(Listing, { foreignKey: 'listingId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Message,
  Conversation,
  Listing
};
