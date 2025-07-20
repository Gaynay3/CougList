const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');

class Message extends Model {}

Message.init({
  id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references:{
    //   model:'users',
    //   key:'id'
    // }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Message'
});

module.exports = Message; 
