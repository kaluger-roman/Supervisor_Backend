'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Records', 'duration', Sequelize.DECIMAL);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Records', 'duration');
  },
};
