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
            User.hasMany(models.Transaction, {
                as: 'investment'
            })
            User.hasMany(models.Transaction, {
                as: 'percentages'
            })
            User.hasMany(models.Invite)
            User.belongsTo(models.User, {
                as: 'inviter',
                foreignKey: 'InviterId'
            })
            User.hasMany(models.User, {
                as: 'invited_users',
                foreignKey: 'InviterId',
            })
        }
    }

    User.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.first_name} ${this.last_name}`
            }
        },
        email: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            set(value) {
                this.setDataValue('password', bcrypt.hashSync(value, 10))
            }
        },
        balance: {
            type: DataTypes.DOUBLE,
            get() {
                const rawValue = this.getDataValue('balance');
                return rawValue ? rawValue.toFixed(2) : 0;
            }
        },
        RoleId: DataTypes.INTEGER,
        InviterId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
