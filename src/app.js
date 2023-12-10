import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import passportConfig from './passport/index.js';
import session from 'express-session';
import fileStore from 'session-file-store';
import methodOverride from 'method-override';
import path from 'path';
import redis from 'redis';
import flash from 'connect-flash';

import router from './routers/index.js';
import ErrorHandler from './middlewares/ErrorHandler.js';

const port = process.env.PORT;
const app = express();

//passport의 다양한 전략 구성및 설정하는데 도와줌__ 이거 주석해놔서 애먹었는데 진짜 기억하자!!
passportConfig();

const FileStore = fileStore(session);
const __dirname = path.resolve();
const redisClient = redis.createClient();

//레디스 연결 테스트
// redisClient.on('connect', () => {
// 	console.log('redis connection success');
// });

// redisClient.on('error', (err) => {
// 	console.log('redis connection error');
// 	console.log(err);
// });
redisClient.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

//모든 코드에서 세션 미들웨어가 작동하도록
app.use(
	session({
		secret: '342dfsdsd',
		resave: false,
		saveUninitialized: false,
		store: new FileStore(), //임시용. db에 저장하는게 더나음.
		cookie: {
			httpOnly: true,
			secure: false //true로 하면 https만 가능.
		}
	})
);
app.use(flash());

app.use(passport.initialize());
//session 객체에 passport 정보 저장. _> 실행되면 세션쿠키정보 바탕으로 index.js의 deserializeUser 실행.
app.use(passport.session());
//local 전략에서 passport를 사용하면서 내부적으로 session을 사용할것이기 때문에 세션 필요함

app.use('/api', router);
app.use(ErrorHandler);

app.listen(port, () => {
	console.log(port, '번 포트가 열렸어요');
});
