import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import bcrypt from 'bcrypt';

import { prisma } from '../utils/prisma/index.js';

import dotenv from 'dotenv';
dotenv.config();

import redis from 'redis';
const redisClient = redis.createClient();
redisClient.connect();

export default () => {
	passport.use(
		new KakaoStrategy(
			{
				clientID: process.env.KAKAO_ID,
				callbackURL: process.env.KAKAO_CALLBACK_URL
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const email = profile._json.kakao_account.email;
					const existUser = await prisma.users.findFirst({ where: { email } });

					//해당하는 유저 있을경우 토큰 저장
					if (existUser) {
						await redisClient.set('refreshToken', refreshToken);
						await redisClient.expire('refreshToken', 60 * 60 * 24);

						existUser.accessToken = accessToken;
						done(null, existUser);
					}
					//해당하는 유저 없을 경우
					else {
						const hashKakaoPassword = await bcrypt.hashSync(String(profile.id), 10);
						const newUser = await prisma.users.create({
							data: {
								nickname: profile._json.kakao_account.email.split('@')[0],
								email: profile._json.kakao_account.email,
								password: hashKakaoPassword,
								snsId: profile.id,
								provider: 'kakao'
							}
						});
						await redisClient.set('refreshToken', refreshToken);
						await redisClient.expire('refreshToken', 60 * 60 * 24);

						newUser.accessToken = accessToken;
						done(null, newUser);
					}
				} catch (err) {
					done(err);
				}
			}
		)
	);
};
