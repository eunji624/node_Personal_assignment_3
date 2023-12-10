export class ProductsController {
	constructor(productsService) {
		this.productsService = productsService;
	}

	createProduct = async (req, res, next) => {
		try {
			const { title, content, price } = req.body;
			const userId = req.user.id;
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

			// res.render('main', { data: productsList });
			return res.status(200).json({ data: productsList });
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
			next(err);
		}
	};

	updateProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { title, content, price } = req.body;
			const userId = req.user.id;

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
