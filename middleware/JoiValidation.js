const Joi = require('joi');

//회원가입 유효성 검사
const registerValidation = async (req, res, next) => {
	const schema = Joi.object({
		nick_name: Joi.string().min(2).max(30).required().messages({
			'string.empty': '닉네임을 입력해 주세요.'
		}),
		email: Joi.string()
			.email({ minDomainSegments: 2, maxDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required()
			.messages({
				'string.email': '이메일을 확인해 주세요.',
				'string.empty': '이메일을 입력해 주세요'
			}),
		password: Joi.string().min(6).required().messages({
			'string.empty': '비밀번호를 입력해 주세요',
			'string.min': '비밀번호는 6자리 이상이여야 합니다.'
		}),
		passwordRe: Joi.any().valid(Joi.ref('password')).required().messages({
			'any.only': '비밀번호가 일치하지 않습니다.'
		}),
		birth_date: Joi.date().allow('').iso().min('1-1-1920').max('1-1-2021').messages({
			'date.format': '1920 ~ 2020 출생자만 입력이 가능합니다. (년-월-일 형식).'
		}),
		address: Joi.string().allow('')
	});
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (err) {
		const message = err.details[0].message;
		res.status(400).json({ message });
		next(err);
	}
};

//로그인 유효성 검사
const loginValidation = async (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				maxDomainSegments: 2,
				tlds: { allow: ['com', 'net'] }
			})
			.required()
			.messages({
				'string.email': '이메일을 확인해 주세요.',
				'string.empty': '이메일을 입력해 주세요'
			}),
		password: Joi.string().min(6).required().messages({
			'string.empty': '비밀번호를 입력해 주세요',
			'string.min': '비밀번호는 6자리 이상이여야 합니다.'
		})
	});
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (err) {
		const message = err.details[0].message;
		res.status(400).json({ message });
		next(err);
	}
};

//상품 작성 유효성 검사
const newProductValidation = async (req, res, next) => {
	const schema = Joi.object({
		product_name: Joi.string().required().messages({
			'string.empty': '상품명을 입력해 주세요.'
		}),
		price: Joi.number().required().messages({
			'number.base': '가격을 입력해 주세요,'
		}),
		comment: Joi.string().required().messages({
			'string.empty': '내용을 입력해 주세요,'
		}),
		buy_date: Joi.date().allow('').iso().max('now').messages({
			'date.format': '입력하신 날짜를 확인해 주세요. (년-월-일 형식).'
		}),
		status: Joi.string()
	});
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (err) {
		const message = err.details[0].message;
		res.status(400).json({ message });
		next(err);
	}
};

module.exports = { registerValidation, loginValidation, newProductValidation };
