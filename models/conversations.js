const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Conversation extends Model {}

Conversation.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listingId: {
    type: DataTypes.INTEGER,
    allowNull:true
  },
  user1Id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user2Id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
  {
  sequelize,
  modelName: 'Conversation'
});

module.exports = Conversation;



