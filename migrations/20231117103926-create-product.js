'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Product', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'User',
					id: 'id'
				}
			},
			product_name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			price: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			status: {
				allowNull: false,
				type: Sequelize.STRING,
				defaultValue: 'FOR_SALE'
			},
			comment: {
				allowNull: false,
				type: Sequelize.STRING
			},
			buy_date: {
				type: Sequelize.DATE
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
		await queryInterface.dropTable('Product');
	}
};
