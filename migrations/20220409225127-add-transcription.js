'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Records', 'srcMerged', Sequelize.STRING);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Records', 'srcMerged');
  },
};
