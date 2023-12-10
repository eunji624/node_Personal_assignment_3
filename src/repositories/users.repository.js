export class UsersRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	createUser = async (nickname, email, password) => {
		const createdUser = await this.prisma.users.create({
			data: {
				nickname,
				email,
				password
			}
		});

		return createdUser;
	};

	//로그인
	findUser = async (email) => {
		const existUser = await this.prisma.users.findFirst({ where: { email: email } });
		return existUser;
	};

	//유저 닉네임이 존재하나요?
	existUserNickname = async (nickname) => {
		const existUser = await this.prisma.users.findFirst({ where: { nickname: nickname } });
		return existUser;
	};

	//회원 로그아웃
	updateUser = async (userId) => {
		const updateUser = await this.prisma.users.updateMany({ where: { id: +userId }, data: { refreshToken: '' } });
		return updateUser;
	};

	//회원 탈퇴
	deleteUser = async (userId) => {
		console.log('컨트롤러단', userId);

		const deleteUser = await this.prisma.users.delete({ where: { id: userId } });
		return deleteUser;
	};
}
