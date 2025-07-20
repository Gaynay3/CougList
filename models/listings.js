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

  location:{
    type:DataTypes.STRING,
    allowNull: false
  },
  image:{
    type: DataTypes.JSON,
    allowNull: true
  },
  sellerId:{
    type: DataTypes.INTEGER
  },
  category: {
  type: DataTypes.STRING,
  allowNull: true
},
delivery: {
  type: DataTypes.STRING,
  allowNull: true
},
condition: {
  type: DataTypes.STRING,
  allowNull: true
},
dimensions: {
  type: DataTypes.STRING,
  allowNull: true
}
},
{
  sequelize,
  modelName: 'Listings'
});

module.exports = Listings;


