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
						} else {
							console.log('로컬스트레테지 유저', existUser);
							const accessToken = await jwt.sign({ userId: existUser.id }, process.env.SECRET_KEY, {
								expiresIn: '2h'
							});
							const refreshToken = await jwt.sign(
								{ refreshToken: existUser.id + '@refresh', userId: existUser.id },
								process.env.SECRET_KEY,
								{
									expiresIn: '1d'
								}
							);

							//리프레쉬는 레디스에,
							// const updateUser = await prisma.users.update({
							// 	where: { id: existUser.id },
							// 	data: { refreshToken: refreshToken }
							// });

							await redisClient.set('refreshToken', refreshToken);
							await redisClient.expire('refreshToken', 60 * 60 * 24);

							// console.log('updateUser', updateUser);
							// console.log('accessToken', accessToken);
							// console.log('refreshToken', refreshToken);
							existUser.accessToken = accessToken;
							// existUser.refreshToken = refreshToken;

							done(null, existUser, { message: '로그인 되었습니다.' });
						}
					} else {
						done(null, false, { message: '회원가입을 해주세요.' });
					}
				} catch (err) {
					console.error(err);
					done(err);
				}
			}
		)
	);
};
