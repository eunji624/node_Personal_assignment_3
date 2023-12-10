export class ProductsService {
	constructor(productsRepository, jwt, SECRET_KEY) {
		this.productsRepository = productsRepository;
		this.jwt = jwt;
		this.SECRET_KEY = SECRET_KEY;
	}

	createProduct = async (title, content, price, user) => {
		console.log('서비스', user);
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
		console.log(Boolean(queryString));
		const noQueryStr = queryString == {};
		let queryValue;
		console.log(noQueryStr);

		if (!queryString.sort && noQueryStr) {
			throw new Error('올바른 주소값이 아닙니다.');
		}

		if (noQueryStr) {
			queryValue = queryString.sort.toLowerCase();
		} else if (!noQueryStr) {
			queryValue = 'desc';
		}
		//queryValue !== 'desc' || queryValue !== 'asc' 로 에러처리시
		//둘중 하나라도 참인경우 바로 에러메세지 반환해서 이렇게 작성했습니다.
		if (queryValue === 'desc' || queryValue === 'asc') {
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
		}
		// else {
		// throw new Error('올바른 주소값이 아닙니다.');
		// }
	};

	getProductDetail = async (productId) => {
		const productDetail = await this.productsRepository.findFirstProduct(productId);
		if (!productDetail) throw new Error('해당하는 상품글이 존재하지 않습니다.');

		return productDetail;
	};

	updateProduct = async (productId, title, content, price, user) => {
		const productExist = await this.productsRepository.findFirstProduct(productId);
		if (!productExist) throw new Error('해당하는 상품글이 존재하지 않습니다.');
		console.log('productExist', productExist);
		console.log('user', user);

		if (productExist.user_id !== user) {
			throw new Error('수정 권한이 없습니다.');
		}
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
		const productExist = await this.productsRepository.findFirstProduct(productId);
		if (!productExist) throw new Error('해당하는 상품글이 존재하지 않습니다.');

		if (productExist.user_id !== user) {
			throw new Error('삭제 권한이 없습니다.');
		}

		const deleteProduct = await this.productsRepository.deleteProduct(productId);

		return deleteProduct;
	};
}
