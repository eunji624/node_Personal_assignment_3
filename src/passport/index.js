import passport from 'passport';
import local from './localStrategy.js';
import kakao from './kakaoStrategy.js';
import { prisma } from '../utils/prisma/index.js';

export default () => {
	passport.serializeUser((user, done) => {
		let newUser = {
			id: user.id,
			accessToken: user.accessToken
		};
		done(null, newUser);
	});

	passport.deserializeUser((user, done) => {
		user = user.id;
		prisma.users
			.findFirst({ where: { id: user } })
			.then((user) => {
				done(null, user);
			})
			.catch((err) => console.log(err));
	});

	local();
	kakao();
};
