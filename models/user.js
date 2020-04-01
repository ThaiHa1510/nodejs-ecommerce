'use strict';
module.exports = (sequelize) => {
    const { Sequelize, DataTypes } = require('sequelize');
  var User = sequelize.define('User', {
    username: DataTypes.STRING
  });

  User.associate = function(models) {
    models.User.hasMany(models.Task);
  };

  return User;
};