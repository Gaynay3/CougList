const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class User extends Model {}

User.init({
  username: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;


