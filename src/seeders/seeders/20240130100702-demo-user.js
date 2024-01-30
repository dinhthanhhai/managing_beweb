"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "jhon@gmail.com",
          password: "123123",
          username: "John Doe",
        },
        {
          email: "lamcaigido@gmail.com",
          password: "123123",
          username: "Lam Do",
        },
        {
          email: "nguyenvan a@gmail.com",
          password: "123123",
          username: "Nguyen Van",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
