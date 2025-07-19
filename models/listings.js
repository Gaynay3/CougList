const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Listings extends Model {}

Listings.init({
  title:{
    type:DataTypes.STRING,
    allowNull: false
  },
  description: {
    type:DataTypes.TEXT,
    allowNull: false
  },
  price:{
    type:DataTypes.FLOAT,
    allowNull: false
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true
  },
  sellerId:{
    type: DataTypes.INTEGER
  }
},
{
  sequelize,
  modelName: 'Listings'
});

module.exports = Listings;


