import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import redis from 'redis';

const redisClient = redis.createClient();
redisClient.connect();

import { prisma } from '../utils/prisma/index.js';
import { UsersController } from '../controllers/users.controller.js';
import { UsersService } from '../services/users.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

import { alreadyLogin, alreadyExist, alreadyLogout } from '../middlewares/auth.js';
import { registerValidation, loginValidation } from '../middlewares/JoiValidation.js';
const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository, bcrypt); //많아지면 어떻게 처리하지?
const usersController = new UsersController(usersService);

//회원가입 기능
router.post('/register', registerValidation, alreadyExist, usersController.createUser);

//로그인 화면 보여주기 (로컬로그인, 카카오로그인 테스트용)
router.get('/login', (req, res, next) => res.render('login'));

//로그인 기능(pssport-local)
router.post('/login', loginValidation, alreadyLogin, usersController.localLogin);

//로그인 기능(pssport-kakao)
router.get('/kakao', passport.authenticate('kakao'));
router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		successRedirect: '/api/products',
		failureRedirect: '/api/auth/login'
	})
);

//로그아웃 기능
router.get('/logout', alreadyLogout, usersController.clearCookieLogout);

//회원탈퇴 기능
router.delete('/unregister', alreadyLogout, usersController.deleteUserInfo);

export default router;
