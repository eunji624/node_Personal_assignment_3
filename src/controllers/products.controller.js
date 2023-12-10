export class ProductsController {
	constructor(productsService) {
		this.productsService = productsService;
	}

	createProduct = async (req, res, next) => {
		console.log('쿠키 컨트롤러단 확인', req.cookies);
		try {
			const { title, content, price } = req.body;
			console.log('req.user', req.user);
			const userId = req.user.id;
			if (!title || !content || !price) {
				throw new Error('입력값이 없습니다.');
			}

			const newProduct = await this.productsService.createProduct(title, content, price, userId);

			return res.status(201).json({ data: newProduct });
		} catch (err) {
			next(err);
		}
	};

	getProductsList = async (req, res, next) => {
		try {
			const queryString = req.query;
			const productsList = await this.productsService.getProductsList(queryString);
			console.log('req.user', req.user);
			console.log('req.session', req.session);
			console.log('req.cookie', req.cookie);

			res.render('main', { data: productsList });
			// return res.status(200).json({ data: productsList });
		} catch (err) {
			next(err);
		}
	};

	getProductDetail = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const productDetail = await this.productsService.getProductDetail(productId);

			return res.status(200).json({ data: productDetail });
		} catch (err) {
			console.log('err', err);
			next(err);
		}
	};

	updateProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { title, content, price } = req.body;
			const userId = req.user.id;

			if (!title || !content || !price) {
				throw new Error('입력값이 없습니다.');
			}

			const updateProduct = await this.productsService.updateProduct(productId, title, content, price, userId);

			return res.status(200).json({ data: updateProduct });
		} catch (err) {
			next(err);
		}
	};

	deleteProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const userId = req.user.id;

			const deleteProduct = await this.productsService.deleteProduct(productId, userId);

			return res.status(200).json({ message: '해당하는 게시글이 삭제되었습니다.', data: deleteProduct });
		} catch (err) {
			next(err);
		}
	};
}
