import passport from 'passport';

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

	localLogin = async (req, res, next) => {
		passport.authenticate(
			'local',
			{
				successRedirect: '/api/products',
				failureRedirect: '/api/auth/login'
			},
			async (err, user, info) => {
				// if (err) {
				// 	throw new Error(err.message);
				// }
				// if (!user) {
				// 	throw new Error(info.message);
				// 	//Error: 회원가입을 해주세요.
				// 	//Error: 비밀번호가 일치하지 않습니다.
				// }
				try {
					return req.login(user, (loginError) => {
						if (loginError) {
							return next(loginError);
						}
						res.cookie('accessToken', user.accessToken);
						return res.status(200).json({ message: info.message });
					});
				} catch (err) {
					next(err);
				}
			}
		)(req, res, next);
	};

	//회원 로그아웃
	clearCookieLogout = async (req, res, next) => {
		try {
			await this.usersService.deleteRefreshToken();

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
		try {
			const { id } = req.user;

			//카카오 로그인 한 경우.
			if (req.user.provider === 'kakao') {
				let accessToken = req.session.passport.user.accessToken;
				const disconnect = await this.usersService.disconnectKakao(accessToken);
			}

			//리프레쉬 토큰 및 회원데이터 삭제.
			await this.usersService.deleteRefreshToken();
			const deleteUser = await this.usersService.deleteUser(id);

			//쿠키에 저장된 세션 삭제
			await req.logout(() => req.session.destroy());
			await res.clearCookie('connect.sid');
			await res.clearCookie('accessToken');

			return res.status(200).json({ message: '정상적으로 회원탈퇴 되었습니다.', deleteUser });
		} catch (err) {
			next(err);
		}
	};
}
