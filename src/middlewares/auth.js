import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma/index.js';
import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient();
redisClient.connect();

const SECRET_KEY = process.env.SECRET_KEY;

//verify해주는 함수__ 오류..
// const verifyMachine = async (jwt) => {
// 	console.log('==>', jwt);
// 	try {
// 		const verifyTrue = await jwt.verify(jwt, SECRET_KEY);
// 		return verifyTrue;
// 	} catch (err) {
// 		console.log(err);
// 		return new Error('유효하지 않은 토큰입니다.');
// 	}
// };

//인증된 사용자인지 검증합니다.
async function authMiddleware(req, res, next) {
	try {
		console.log('알이큐 세션', req.session);
		console.log('알이큐 쿠키', req.cookies);
		console.log('알이큐 유저', req.user);
		const redisGetToken = await redisClient.get('refreshToken');
		console.log('리프레쉬토큰 레디스에서', redisGetToken);
		if (!req.cookies.accessToken) {
			throw new Error('로그인을 해주세요');
		}

		const accessToken = req.cookies.accessToken;
		console.log('accessToken', accessToken);

		console.log('process.env.SECRET_KEY', process.env.SECRET_KEY);
		try {
			//엑세스토큰 검증 및 남은 시간 계산
			const verifyAccessToken = jwt.verify(accessToken, process.env.SECRET_KEY);

			let time = Math.floor(Date.now() / 1000);
			const expiresTime = verifyAccessToken.exp - time;

			console.log('verifyAccessToken', verifyAccessToken);
			console.log(expiresTime);

			//access 가 10분보다 적게 남았으면
			if (verifyAccessToken.exp - time < 600) {
				console.log('적게 남았어요!!');

				//리프레쉬 토큰 꺼내서 검증.
				const userDataRefresh = await prisma.users.findFirst({ where: { id: verifyAccessToken.userId } });
				console.log('userDataRefresh', userDataRefresh);
				const oldRefreshToken = userDataRefresh.refreshToken;
				console.log('oldRefreshToken', oldRefreshToken);

				const token = await axios.post(
					'https://kauth.kakao.com/oauth/token	',
					{
						grant_type: 'refresh_token',
						client_id: `${process.env.KAKAO_ID}`,
						refresh_token: oldRefreshToken
					},
					{
						headers: {
							'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
							Authorization: `Bearer ${accessToken}`
						}
					}
				);

				// const verifyRefreshToken = verifyMachine(userDataRefresh.refreshToken);
				const verifyRefreshToken = jwt.verify(oldRefreshToken, process.env.SECRET_KEY);
				console.log('verifyRefreshToken', verifyRefreshToken);

				//새로운 accessToken 만들기.
				const accessToken = jwt.sign({ userId: userDataRefresh.id }, process.env.SECRET_KEY, {
					expiresIn: '10m'
				});
				console.log('엑세스토큰 재발급 중');

				console.log('new_accessToken', accessToken);
				if (req.cookies) {
					await res.clearCookie('accessToken');
					await res.clearCookie('connect.sid');
				}
				console.log('쿠키 삭제 됬나요?', req.cookie);
				res.cookie('accessToken', accessToken);
				res.cookie('userId', verifyAccessToken.userId);

				console.log('req.cookie', req.cookie);

				req.user = {
					...userDataRefresh
				};

				const refreshTokenExp = verifyRefreshToken.exp - time;
				//근데 만약 리프레쉬 토큰의 유효기간도 얼마 안남았다면?10분 이내라면?
				if (refreshTokenExp > 0 && refreshTokenExp < 600) {
					console.log('리프레쉬토큰 재발급 중');
					const refreshToken = jwt.sign({ refreshToken: verifyAccessToken.userId }, process.env.SECRET_KEY, {
						expiresIn: '2d'
					});

					const userUpdateRefresh = await prisma.users.update({
						where: { id: userDataRefresh.id },
						data: { refreshToken: refreshToken }
					});
					console.log('userUpdateRefresh', userUpdateRefresh);
				}
			}
			next();
		} catch (err) {
			console.log('err', err);
			next(err);
		}
	} catch (err) {
		console.log('err', err);
		next(err);
	}
}

//이미 로그인한 회원인지 검증합니다.
async function alreadyLogin(req, res, next) {
	try {
		// passport는 req 객체에 isAuthenticated 메서드를 추가한다.
		// 로그인 중이면 req.isAuthenticated()가 true이고 아니면 false이다.
		if (req.isAuthenticated() || req.user) {
			//세션에 인증된 사용자인지 검증하는 애. 근데 세션 안쓸꺼면 의미 없음.
			throw new Error('이미 로그인한 회원입니다.');
		}

		next();
	} catch (err) {
		next(err);
	}
}

//이미 존재하는 사용자인지 검증합니다.
async function alreadyExist(req, res, next) {
	try {
		const { nickname, email } = req.body;
		const existUserEmail = await prisma.users.findFirst({ where: { email } });
		if (existUserEmail) {
			throw new Error('이미 존재하는 이메일 입니다.');
		}
		const existUserNickname = await prisma.users.findFirst({ where: { nickname } });
		if (existUserNickname) {
			throw new Error('이미 존재하는 이메일 입니다.');
		}
		next();
	} catch (err) {
		console.log('err', err);
		next(err);
	}
}

//이미 탈퇴한 사용자인지 검증
async function alreadyLogout(req, res, next) {
	try {
		if (!req.user) {
			throw new Error('회원정보가 없음으로 접근할 수 없습니다.');
		}
		next();
	} catch (err) {
		next(err);
	}
}
export { authMiddleware, alreadyLogin, alreadyExist, alreadyLogout };
