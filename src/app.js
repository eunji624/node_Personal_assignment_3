import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import fileStore from 'session-file-store';
import methodOverride from 'method-override';
import path from 'path';
import redis from 'redis';
import flash from 'connect-flash';

import router from './routers/index.js';
import passportConfig from './passport/index.js';
import ErrorHandler from './middlewares/ErrorHandler.js';

const port = process.env.PORT;
const app = express();
dotenv.config();
passportConfig();

const FileStore = fileStore(session);
const __dirname = path.resolve();
const redisClient = redis.createClient();

redisClient.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use(
	session({
		secret: '342dfsdsd',
		resave: false,
		saveUninitialized: false,
		store: new FileStore(), //임시용. db에 저장하는게 더나음.
		cookie: {
			httpOnly: true,
			secure: false
		}
	})
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', router);
app.use(ErrorHandler);

app.listen(port, () => {
	console.log(port, '번 포트가 열렸어요');
});
