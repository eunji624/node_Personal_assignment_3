'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			this.hasMany(models.Product, {
				sourceKey: 'id',
				foreignKey: 'user_id'
			});
		}
	}
	User.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			nick_name: {
				unique: true,
				allowNull: false,
				type: DataTypes.STRING
			},
			email: {
				unique: true,
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					isEmail: true
				}
			},
			password: {
				allowNull: false,
				type: DataTypes.STRING
			},
			// birth_year: {
			// 	type: DataTypes.INTEGER
			// },
			// birth_month: {
			// 	type: DataTypes.INTEGER
			// },
			// birth_day: {
			// 	type: DataTypes.INTEGER
			// },
			birth_date: {
				type: DataTypes.INTEGER
			},
			address: {
				type: DataTypes.STRING
			}
		},
		{
			sequelize,
			modelName: 'User',
			freezeTableName: true //테이블명 자동 복수 설정 막기
		}
	);
	return User;
};
