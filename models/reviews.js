'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define('Reviews', {
    detail: DataTypes.STRING,
    image: {
      type:DataTypes.STRING,
      defaultValue:"/user/default.png"
    },
    scope: DataTypes.INTEGER,
    ProductId: {
      type:DataTypes.INTEGER,
      allowNull:false,

    },
    email:{
      type:DataTypes.STRING
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: {
      type:DataTypes.DATE,
      defaultValue: new Date(),
    }


  }, {});
  Reviews.associate = function(models) {
    // associations can be defined here
  };
  (async () => {
  await Reviews.sync();})
  return Reviews;
};