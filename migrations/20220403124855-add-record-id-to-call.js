'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Calls', 'recordId', Sequelize.INTEGER);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Calls', 'recordId');
  },
};
