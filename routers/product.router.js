const express = require('express');
const { User, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth.js');
const { newProductValidation } = require('../middleware/JoiValidation.js');
const { UriIncorrectError, ProductDosntExistError, NoPermissionError } = require('../middleware/CustomError.js');
const router = express.Router();

// User.destroy({
// 	where: { id: 1 }
// });

//상품 작성하기
router.post('/product', authMiddleware, newProductValidation, async (req, res, next) => {
	const user_id = res.locals.user.id;
	const { product_name, price, comment, buy_date } = req.body;

	try {
		const newProduct = await Product.create({ user_id, product_name, price, comment, buy_date });
		return res.status(201).json({ success: true, message: '상품 업로드 완료하였습니다.', newProduct });
	} catch (err) {
		next(err);
	}
});

//상품 리스트 보여주기
router.get('/products', authMiddleware, async (req, res, next) => {
	try {
		const emptyQuery = {};
		if (!req.query.sort && req.query !== emptyQuery) {
			throw new UriIncorrectError();
		}

		const sortValue = await req.query.sort.toLowerCase();

		if (req.query === emptyQuery || sortValue === 'desc') {
			sort = 'desc';
		} else if (sortValue === 'asc') {
			sort = 'asc';
		} else {
			throw new UriIncorrectError();
		}

		const productJoinUser = await Product.findAll({
			include: { model: User },
			order: [['updatedAt', sort]]
		});

		const showList = productJoinUser.map((data) => {
			return {
				id: data.id,
				nick_name: data.User.nick_name,
				product_name: data.product_name,
				comment: data.comment,
				status: data.status,
				updatedAt: data.updatedAt
			};
		});

		return res.status(200).json({ success: true, message: '상품 리스트 조회 성공하였습니다.', showList });
	} catch (err) {
		next(err);
	}
});

//상품 상세 보여주기
router.get('/product/detail/:id', authMiddleware, async (req, res, next) => {
	try {
		const productJoinUser = await Product.findOne({
			where: { id: req.params.id },
			include: {
				model: User
			}
		});
		if (!productJoinUser) {
			throw new ProductDosntExistError();
		}
		const showList = {
			id: productJoinUser.id,
			nick_name: productJoinUser.User.nick_name,
			product_name: productJoinUser.product_name,
			comment: productJoinUser.comment,
			status: productJoinUser.status,
			price: productJoinUser.price,
			createdAt: productJoinUser.createdAt,
			updatedAt: productJoinUser.updatedAt
		};

		return res.status(200).json({ success: true, message: '상품 리스트 조회 성공하였습니다.', showList });
	} catch (err) {
		next(err);
	}
});

//상품 수정하기
router.patch('/product/:id', authMiddleware, newProductValidation, async (req, res, next) => {
	try {
		const { product_name, comment, status, price } = req.body;
		const { id } = req.params;

		const willModifyData = await Product.findOne({
			where: { id },
			include: User
		});

		if (!willModifyData) {
			throw new ProductDosntExistError();
		}

		const writerId = willModifyData.User.id;
		const userId = res.locals.user.id;
		if (writerId !== userId) {
			throw new NoPermissionError();
		}

		await Product.update({ product_name, comment, status, price }, { where: { id } });
		return res.status(200).json({ message: '상품이 수정되었습니다.' });
	} catch (err) {
		next(err);
	}
});

//상품 삭제하기
router.delete('/product/:id', authMiddleware, async (req, res, next) => {
	try {
		const paramsId = req.params.id;
		const userId = res.locals.user.id;
		const deleteData = await Product.findOne({ where: { id: paramsId } });

		if (!deleteData) {
			throw new ProductDosntExistError();
		}

		if (userId !== deleteData.user_id) {
			throw new NoPermissionError();
		}

		await Product.destroy({ where: { id: paramsId } });
		return res.status(200).json({ message: '상품이 삭제되었습니다.' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
