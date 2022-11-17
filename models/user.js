'use strict';
const {
    Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Role)
            User.hasMany(models.Transaction);
        }
    }

    User.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        balance: DataTypes.DOUBLE,
        RoleId: DataTypes.INTEGER,
        InviterId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
