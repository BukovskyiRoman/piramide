'use strict';

const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Users', [{
          first_name: 'Big',
          last_name: 'Boss',
          email: 'admin@email.com',
          password: bcrypt.hashSync('12345678', 10),
          balance: 0,
          RoleId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
      }]);
  },

  async down (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
