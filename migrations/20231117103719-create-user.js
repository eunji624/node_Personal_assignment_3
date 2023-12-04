'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('User', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			nick_name: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING,
				validate: {
					isEmail: true
				}
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			birth_year: {
				type: Sequelize.INTEGER
			},
			birth_month: {
				type: Sequelize.INTEGER
			},
			birth_day: {
				type: Sequelize.INTEGER
			},
			address: {
				type: Sequelize.STRING
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
		await queryInterface.dropTable('User');
	}
};
