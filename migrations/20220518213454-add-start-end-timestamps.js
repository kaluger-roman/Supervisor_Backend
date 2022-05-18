'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Calls',
      'startTimestamp',
      Sequelize.DECIMAL,
    );
    await queryInterface.addColumn('Calls', 'endTimestamp', Sequelize.DECIMAL);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Calls', 'startTimestamp');
    await queryInterface.removeColumn('Calls', 'endTimestamp');
  },
};
