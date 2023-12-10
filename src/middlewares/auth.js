import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import passport from 'passport';
import { prisma } from '../utils/prisma/index.js';
import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient();
redisClient.connect();

//인증된 사용자인지 검증합니다.
async function authMiddleware(req, res, next) {
	try {
		const redisGetToken = await redisClient.get('refreshToken');
		if (!req.cookies.accessToken && !req.session.passport.user) {
			throw new Error('로그인을 해주세요.');
		}

		//카카오 로그인인 경우
		if (req.user.provider === 'kakao') {
			kakaoAuthMiddleware(req, res, next, redisGetToken);
		}
		//카카오 로그인이 아닌 경우
		else {
			const accessToken = req.cookies.accessToken;
			localAuthMiddleware(req, res, next, accessToken);
		}
	} catch (err) {
		next(err);
	}
}

//카카오 인증 미들웨어
async function kakaoAuthMiddleware(req, res, next, redisGetToken) {
	try {
		const accessToken = req.session.passport.user.accessToken;

		//1. accessToken을 받아옵니다.
		const getKakaoAccessToken = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
				Authorization: `Bearer ${accessToken}`
			}
		});

		//2. accessToken 만료기한을 파악 후 10분 이내라면
		const expireTime = getKakaoAccessToken.data.expires_in;
		if (expireTime < 39600) {
			const getKakaoNewToken = await axios.post(
				'https://kauth.kakao.com/oauth/token',
				{
					grant_type: 'refresh_token',
					client_id: `${process.env.KAKAO_ID}`,
					refresh_token: redisGetToken
				},
				{
					headers: {
						'Content-type': 'application/x-www-form-urlencoded',
						Authorization: `Bearer ${accessToken}`
					}
				}
			);

			//새로받은 토큰에 리프레쉬 토큰이 있다면
			if (getKakaoNewToken.data.refresh_token) {
				await redisClient.del('refreshToken');
				await redisClient.set('refreshToken', getKakaoRefreshToken);
				await redisClient.expire('refreshToken', 60 * 60 * 24);
			}

			res.cookie('accessToken', getKakaoNewToken.data.access_token);
			next();
		}
	} catch (err) {
		next(err);
	}
}

//로컬 인증 미들웨어
async function localAuthMiddleware(req, res, next, accessToken) {
	try {
		//엑세스토큰 검증 및 남은 시간 계산
		const verifyAccessToken = jwt.verify(accessToken, process.env.SECRET_KEY);
		const id = verifyAccessToken.userId;
		let time = Math.floor(Date.now() / 1000);
		const expiresTime = verifyAccessToken.exp - time;

		//access 가 10분보다 적게 남았으면
		if (expiresTime < 600) {
			//리프레쉬 토큰 꺼내서 검증.
			const verifyRefreshToken = jwt.verify(redisGetToken, process.env.SECRET_KEY);

			//새로운 accessToken 만들기.
			const accessToken = jwt.sign({ userId: id }, process.env.SECRET_KEY, {
				expiresIn: '10m'
			});

			if (req.cookies) {
				await res.clearCookie('accessToken');
				await res.clearCookie('connect.sid');
			}

			res.cookie('accessToken', accessToken);
			res.cookie('userId', id);

			req.user = {
				...userDataRefresh
			};

			const refreshTokenExp = verifyRefreshToken.exp - time;
			//근데 만약 리프레쉬 토큰의 유효기간도 얼마 안남았다면?10분 이내라면?
			if (refreshTokenExp > 0 && refreshTokenExp < 600) {
				const refreshToken = jwt.sign({ refreshToken: id }, process.env.SECRET_KEY, {
					expiresIn: '2d'
				});

				await redisClient.set('refreshToken', refreshToken);
				await redisClient.expire('refreshToken', 60 * 60 * 24);
			}
		}
		next();
	} catch (err) {
		next(err);
	}
}

//이미 로그인한 회원인지 검증합니다.
async function alreadyLogin(req, res, next) {
	try {
		if (req.isAuthenticated() || req.user) throw new Error('이미 로그인한 회원입니다.');
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
		if (existUserEmail) throw new Error('이미 존재하는 이메일 입니다.');

		const existUserNickname = await prisma.users.findFirst({ where: { nickname } });
		if (existUserNickname) throw new Error('이미 존재하는 이메일 입니다.');
		next();
	} catch (err) {
		next(err);
	}
}

//이미 탈퇴한 사용자인지 검증
async function alreadyLogout(req, res, next) {
	try {
		if (!req.user) throw new Error('회원정보가 없음으로 접근할 수 없습니다.');
		next();
	} catch (err) {
		next(err);
	}
}

export { authMiddleware, alreadyLogin, alreadyExist, alreadyLogout };
