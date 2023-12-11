import { prisma } from '../utils/prisma/index.js';

async function queryStringValue(req, res, next) {
	try {
		const queryString = req.query;
		const noQueryStr = queryString == {};
		let queryValue;

		if (noQueryStr) {
			queryValue = 'desc';
		} else if (queryString) {
			queryString.sort.toLowerCase();
		}

		if (!queryString.sort) {
			throw new Error('올바른 주소값이 아닙니다.');
		}
		if (queryValue !== 'desc' && queryValue !== 'asc') {
			throw new Error('올바른 주소값이 아닙니다.');
		}
		next();
	} catch (err) {
		console.log(err);
		next(err);
	}
}

async function existProductId(req, res, next) {
	try {
		const { productId } = req.params;
		const findProduct = await prisma.products.findFirst({ where: { id: +productId } });
		if (!findProduct) throw new Error('해당하는 상품글이 존재하지 않습니다.');
		next();
	} catch (err) {
		next(err);
	}
}

async function permissionHave(req, res, next) {
	try {
		const userId = req.user.id;
		const { productId } = req.params;

		const findProduct = await prisma.products.findFirst({ where: { id: +productId } });
		if (findProduct.user_id !== userId) throw new Error('수정 권한이 없습니다.');
		next();
	} catch (err) {
		next(err);
	}
}

export { queryStringValue, existProductId, permissionHave };
