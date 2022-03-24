'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'status', Sequelize.STRING);

    await queryInterface.bulkUpdate('Users', {
      status: 'offline',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'status');
  },
};
