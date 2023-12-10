import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redis from 'redis';
const redisClient = redis.createClient();

redisClient.connect();
import { prisma } from '../utils/prisma/index.js';

const LocalStrategy = passportLocal.Strategy;

export default () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			async (email, password, done) => {
				try {
					const existUser = await prisma.users.findFirst({ where: { email } });

					if (existUser) {
						const result = await bcrypt.compare(password, existUser.password);

						if (!result) {
							done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
						}
						//회원 정보가 일치하다면 토큰 발급
						else {
							const accessToken = jwt.sign({ userId: existUser.id }, process.env.SECRET_KEY, {
								expiresIn: '2h'
							});
							const refreshToken = jwt.sign(
								{ refreshToken: existUser.id + '@refresh', userId: existUser.id },
								process.env.SECRET_KEY,
								{
									expiresIn: '1d'
								}
							);

							await redisClient.set('refreshToken', refreshToken);
							await redisClient.expire('refreshToken', 60 * 60 * 24);

							existUser.accessToken = accessToken;
							done(null, existUser, { message: '로그인 되었습니다.' });
						}
					} else {
						done(null, false, { message: '회원가입을 해주세요.' });
					}
				} catch (err) {
					done(err);
				}
			}
		)
	);
};
