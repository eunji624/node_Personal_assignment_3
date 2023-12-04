'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
		 */
		await queryInterface.removeColumn('User', 'birth_year');
		await queryInterface.removeColumn('User', 'birth_month');
		await queryInterface.removeColumn('User', 'birth_day');

		await queryInterface.addColumn('User', 'birth_date', {
			type: Sequelize.DATE
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
