import passport from 'passport';
import local from './localStrategy.js';
import kakao from './kakaoStrategy.js';
import { prisma } from '../utils/prisma/index.js';

export default () => {
	//시리얼라이즈 유저 세션에 데이터 저장하는애
	passport.serializeUser((user, done) => {
		//done(에러, 세션에 저장할 데이터)
		// if (user.provider === 'kakao') {
		let newUser = {
			id: user.id
			// accessToken: user.accessToken
		};
		console.log('시리얼라이즈유저', newUser);

		done(null, newUser); //deserializeUser로 넘겨준다.
	});

	//세션에 저장된 데이터로 db에서 유저를 찾음. 있으면 req.user에 사용자 정보 전체 저장.
	//만약 쿠키에 세션키가 있다면 deserializeUser먼저 자동 실행된다.
	passport.deserializeUser((user, done) => {
		//세션에 저장을 하고 쿠키로 보내주는?
		console.log('디시리얼라이즈유저', user);
		user = user.id;
		prisma.users
			.findFirst({ where: { id: user } })
			.then((user) => {
				console.log('디디', user);
				done(null, user); //언제든 사용할 수 있도록 req.user로 데이터 넘겨준다.
			})
			.catch((err) => console.log(err));
	});

	local();
	kakao();
};
