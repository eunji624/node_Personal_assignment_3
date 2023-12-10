import axios from 'axios';
import redis from 'redis';
import passport from 'passport';

const redisClient = redis.createClient();
redisClient.connect();
export class UsersController {
	constructor(usersService) {
		this.usersService = usersService;
	}

	createUser = async (req, res, next) => {
		try {
			const { nickname, email, password } = req.body;
			const user = await this.usersService.createUser(nickname, email, password);

			return res.status(201).json({ data: user });
		} catch (err) {
			next(err);
		}
	};

	//로컬 전략 3계층 아키텍쳐 구조화를 어떻게 해야할까....
	localLogin = async (req, res, next) => {
		console.log('this.passport', this.passport);

		passport.authenticate(
			'local',
			{
				successRedirect: '/api/products',
				failureRedirect: '/api/auth/login'
			},
			async (err, user, info) => {
				if (err) {
					console.log('err', err);
					return next(err);
				}
				if (!user) {
					return res.status(401).json({ message: info.message });
				}

				console.log('로컬스토리티지 라우터 user', user);
				return req.login(user, (loginError) => {
					//passport에서 제공하는 긴으임.(세션사용시.)
					console.log('req.user', req.user);

					if (loginError) {
						console.log(loginError);
						return next(loginError);
					}
					res.cookie('accessToken', user.accessToken);
					return res.status(200).json({ message: info.message });
				});
			}
		)(req, res, next);
	};

	//회원 로그아웃
	clearCookieLogout = async (req, res, next) => {
		try {
			await redisClient.del('refreshToken');

			await req.logout(() => req.session.destroy());
			await res.clearCookie('connect.sid');
			await res.clearCookie('accessToken');
			return res.status(200).json({ message: '정상적으로 로그아웃 되었습니다.' });
		} catch (err) {
			next(err);
		}
	};

	//회원 탈퇴.
	deleteUserInfo = async (req, res, next) => {
		console.log('컨트롤러 딜리트유저인포 ', req.user);
		const { id } = req.user;

		try {
			//카카오 로그인 한 경우.
			if (req.user.provider === 'kakao') {
				let accessToken = req.session.passport.user.accessToken;
				const disconnect = await this.usersService.disconnectKakao(accessToken);
				console.log('카카오 연결 끊기 성공입니다.', disconnect.data);
			}

			//리프레쉬 토큰 및 회원데이터 삭제.
			await redisClient.del('refreshToken');
			const deleteUser = await this.usersService.deleteUser(id);

			//쿠키에 저장된 세션 삭제
			await req.logout(() => req.session.destroy());
			await res.clearCookie('connect.sid');
			await res.clearCookie('accessToken');

			return res.status(200).json({ message: '정상적으로 회원탈퇴 되었습니다.', deleteUser });
		} catch (err) {
			console.log('에러 발생', err);
			next(err);
		}
	};
}
