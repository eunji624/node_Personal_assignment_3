import axios from 'axios';

export class UsersService {
	constructor(usersRepository, jwt, bcrypt) {
		this.usersRepository = usersRepository;
		this.jwt = jwt;
		this.bcrypt = bcrypt;
	}

	createUser = async (nickname, email, password) => {
		const hashPassword = this.bcrypt.hashSync(password, 10);
		const user = await this.usersRepository.createUser(nickname, email, hashPassword);

		return {
			id: user.id,
			nickname: user.nickname,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		};
	};

	localCallbackFunction = async (err, user, info) => {
		if (err) {
			console.log('err', err);
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ message: info.message });
		}

		console.log('로컬스토리티지 라우터 user', user);
		return req.login(user, (loginError) => {
			if (loginError) {
				console.log(loginError);
				return next(loginError);
			}
			res.cookie('accessToken', user.accessToken);
			return res.status(200).json({ message: info.message });
		});
	};

	//회원 로그아웃
	updateUser = async (userId) => {
		const updateUser = await this.usersRepository.updateUser(userId);
		return updateUser;
	};

	//회원 탈퇴(로컬)
	deleteUser = async (userId) => {
		console.log('서비스단', userId);
		const deleteUser = await this.usersRepository.deleteUser(userId);
		return { userId: deleteUser };
	};

	//회원 연결 끊기 (카카오)
	disconnectKakao = async (accessToken) => {
		const token = await axios.post(
			'https://kapi.kakao.com/v1/user/unlink',
			{},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		return token;
	};
}
