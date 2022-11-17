'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Transaction.belongsTo(models.User)
    }
  }
  Transaction.init({
    sum: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    invest: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
