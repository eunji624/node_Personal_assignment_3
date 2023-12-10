const ErrorHandler = (err, req, res, next) => {
	console.log('에러헨들러 미들웨어 구동중', err.message);
	if (err.message) {
		return res.status(401).json({ erroerMessage: err.message });
	}

	res.status(500).json({ success: false, erroerMessage: '연결에 실패하였습니다. 잠시후 다시 시도해 주세요.' });
};

export default ErrorHandler;
