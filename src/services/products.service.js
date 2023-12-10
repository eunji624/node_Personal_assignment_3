export class ProductsService {
	constructor(productsRepository) {
		this.productsRepository = productsRepository;
	}

	createProduct = async (title, content, price, user) => {
		const newProduct = await this.productsRepository.createProduct(title, content, price, user);

		return {
			id: newProduct.id,
			user_id: newProduct.user_id,
			title: newProduct.title,
			content: newProduct.content,
			price: newProduct.price,
			createdAt: newProduct.createdAt
		};
	};

	getProductsList = async (queryString) => {
		const productsList = await this.productsRepository.findManyProducts(queryString);

		return productsList.map((e) => {
			return {
				id: e.id,
				user_id: e.user_id,
				title: e.title,
				content: e.content,
				price: e.price,
				createdAt: e.createdAt
			};
		});
	};

	getProductDetail = async (productId) => {
		const productDetail = await this.productsRepository.findFirstProduct(productId);
		return productDetail;
	};

	updateProduct = async (productId, title, content, price, user) => {
		const updateProduct = await this.productsRepository.updateProduct(productId, title, content, price);

		return {
			user_id: updateProduct.user_id,
			title: updateProduct.title,
			content: updateProduct.content,
			price: updateProduct.price,
			createdAt: updateProduct.createdAt,
			updatedAt: updateProduct.updatedAt
		};
	};

	deleteProduct = async (productId, user) => {
		const deleteProduct = await this.productsRepository.deleteProduct(productId);
		return deleteProduct;
	};
}
