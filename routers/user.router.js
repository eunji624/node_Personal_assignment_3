require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');
const { registerValidation, loginValidation } = require('../middleware/JoiValidation.js');
const { alreadyLogin } = require('../middleware/auth.js');
const {
	EmailExistError,
	NickNameExistError,
	UserDosntExistError,
	PasswordIncorrectError
} = require('../middleware/CustomError.js');

const router = express.Router();

//회원가입 기능
router.post('/register', alreadyLogin, registerValidation, async (req, res, next) => {
	const { nick_name, email, password, birth_date, address } = req.body;
	try {
		//이미 존재하는 이메일, 닉네임인 경우
		const sameEmail = await User.findOne({ where: { email } });
		const sameNick_name = await User.findOne({ where: { nick_name } });

		if (sameEmail) {
			throw new EmailExistError();
		}
		if (sameNick_name) {
			throw new NickNameExistError();
		}

		const hashPassword = bcrypt.hashSync(password, 10);
		const newUser = await User.create({
			nick_name,
			email,
			password: hashPassword,
			birth_date,
			address
		});

		const showUser = {
			nick_name: newUser.nick_name,
			email: newUser.email,
			birth_date: newUser.birth_date,
			address: newUser.address
		};
		return res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.', showUser });
	} catch (err) {
		next(err);
	}
});

//로그인 기능
router.post('/auth/login', alreadyLogin, loginValidation, async (req, res, next) => {
	const { email, password } = req.body;

	try {
		//회원이 존재 하는가.
		const sameEmailData = await User.findOne({ where: { email } });
		if (!sameEmailData) {
			throw new UserDosntExistError();
		}

		//비밀번호가 동일한가.
		const isSameUser = bcrypt.compareSync(password, sameEmailData.password);
		if (!isSameUser) {
			throw new PasswordIncorrectError();
		}

		//jwt생성 및 headers로 보내기
		const jwtToken = jwt.sign(
			{
				id: sameEmailData.id,
				nickName: sameEmailData.nickName
			},
			process.env.SECRET_KEY,
			{ expiresIn: '12h' }
		);
		res.header.authorization = `Bearer ${jwtToken}`;
		console.log('jwtToken 확인 => ', jwtToken);
		res.status(200).json({ success: true, message: '로그인 되었습니다.' });
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
