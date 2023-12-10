export class ProductsRepository {
	constructor(prisma, jwt) {
		this.prisma = prisma;
		this.jwt = jwt;
	}

	createProduct = async (title, content, price, user) => {
		const product = await this.prisma.products.create({ data: { title, content, price, user_id: user } });

		return product;
	};

	findManyProducts = async (queryString) => {
		const productsList = await this.prisma.products.findMany({
			orderBy: { createdAt: queryString.sort }
		});

		return productsList;
	};

	findFirstProduct = async (productId) => {
		const productDetail = await this.prisma.products.findFirst({ where: { id: +productId } });

		return productDetail;
	};

	updateProduct = async (productId, title, content, price) => {
		const updateProduct = await this.prisma.products.update({
			where: { id: +productId },
			data: {
				id: +productId,
				title,
				content,
				price
			}
		});
		return updateProduct;
	};

	deleteProduct = async (productId) => {
		const deleteProduct = await this.prisma.products.delete({ where: { id: +productId } });

		return deleteProduct;
	};
}
