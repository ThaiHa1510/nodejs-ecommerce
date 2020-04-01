'use strict';
module.exports = (sequelize) => {
  const { Sequelize, DataTypes } = require('sequelize');
  const Products = sequelize.define('products', {
    category:DataTypes.STRING,
    title: DataTypes.STRING,
    details:DataTypes.STRING,
    price:DataTypes.INTEGER,
    picture:DataTypes.STRING
  }, {timestamps: false});
  /*Products.associate = function(models) {
    // associations can be defined here
  };
  */
  return Products;
};