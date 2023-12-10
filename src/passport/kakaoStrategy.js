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
					if (existUser) {
						// await prisma.users.update({ where: { id: existUser.id }, data: { refreshToken: refreshToken } });
						await redisClient.set('refreshToken', refreshToken);
						await redisClient.expire('refreshToken', 60 * 60 * 24);

						existUser.accessToken = accessToken;
						done(null, existUser);
					} else {
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
						console.log('accessToken 위', accessToken);
						// await prisma.users.update({ where: { id: newUser.id }, data: { refreshToken: refreshToken } });
						await redisClient.set('refreshToken', refreshToken);
						await redisClient.expire('refreshToken', 60 * 60 * 24);

						newUser.accessToken = accessToken;
						// (newUser.refreshToken = refreshToken);
						done(null, newUser);
					}
					console.log('accessToken 아래', accessToken);
					return (accessToken = accessToken);
				} catch (err) {
					console.error(err);
					done(err);
				}
			}
		)
	);
};
