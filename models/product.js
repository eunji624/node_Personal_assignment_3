'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				targetKey: 'id',
				foreignKey: 'user_id'
			});
		}
	}
	Product.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			product_name: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			price: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			status: {
				allowNull: false,
				type: DataTypes.INTEGER,
				defaultValue: 'FOR_SALE'
			},
			comment: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			buy_date: {
				type: DataTypes.INTEGER
			}
		},
		{
			sequelize,
			modelName: 'Product',
			freezeTableName: true //테이블명 자동 복수 설정 막기
		}
	);
	return Product;
};
