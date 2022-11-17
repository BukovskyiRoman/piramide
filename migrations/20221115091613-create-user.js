'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING
            },
            balance: {
                type: Sequelize.DOUBLE,
                default: 0
            },
            RoleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'id'
                },
                allowNull: false
            },
            InviterId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                allowNull: true,
                default: null
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};
