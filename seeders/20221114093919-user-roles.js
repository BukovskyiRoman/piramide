'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Roles', [
            {
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                role: "investor",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
