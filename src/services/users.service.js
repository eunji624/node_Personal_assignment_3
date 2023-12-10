import axios from 'axios';
import redis from 'redis';

const redisClient = redis.createClient();
redisClient.connect();
export class UsersService {
	constructor(usersRepository, bcrypt) {
		this.usersRepository = usersRepository;
		this.bcrypt = bcrypt;
	}

	//회원가입
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

	//회원 로그아웃
	updateUser = async (userId) => {
		const updateUser = await this.usersRepository.updateUser(userId);
		return updateUser;
	};

	//회원 탈퇴(로컬)
	deleteUser = async (userId) => {
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

	//리프레쉬 토큰 삭제
	deleteRefreshToken = async () => {
		return await redisClient.del('refreshToken');
	};
}
