require('dotenv').config();

const development = {
	username: process.env.DB_USER_NAME,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	dialect: process.env.DB_ENGINE
};
const test = {
	username: 'root',
	password: null,
	database: 'database_test',
	host: '127.0.0.1',
	dialect: 'mysql'
};
const production = {
	username: 'root',
	password: null,
	database: 'database_production',
	host: '127.0.0.1',
	dialect: 'mysql'
};

module.exports = { development, test, production };
