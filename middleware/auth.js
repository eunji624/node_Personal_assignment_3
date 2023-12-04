require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { InvalidTokenError, AlreadyLoginError } = require('./CustomError.js');

//인증된 사용자인지 검증합니다.
async function authMiddleware(req, res, next) {
	try {
		const [tokenType, tokenValue] = req.headers.authorization.split(' ');

		if (tokenType !== 'Bearer' || !tokenValue) {
			throw new InvalidTokenError();
		}

		const tokenValueVerify = jwt.verify(tokenValue, process.env.SECRET_KEY);
		const findUser = await User.findOne({ where: { id: tokenValueVerify.id } });
		res.locals.user = findUser;
		next();
	} catch (err) {
		// res.send(err);
		const empty = {};
		if (err.name === 'JsonWebTokenError' || err === empty || err.name === 'TokenExpiredError') {
			next(new InvalidTokenError());
		}
		next(err);
	}
}

//이미 로그인한 회원인지 검증합니다.
async function alreadyLogin(req, res, next) {
	if (!req.headers.authorization) {
		next();
	} else {
		next(new AlreadyLoginError());
	}
}

module.exports = { authMiddleware, alreadyLogin };
