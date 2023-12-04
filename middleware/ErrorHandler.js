const ErrorHandler = (err, req, res, next) => {
	console.log('에러헨들러 미들웨어 구동중', err);

	if (err.name === 'EmailExistError') {
		return res.status(409).json({ success: false, erroerMessage: '이미 존재하는 이메일 입니다.' });
	}

	if (err.name === 'NickNameExistError') {
		return res.status(409).json({ success: false, erroerMessage: '이미 존재하는 닉네임 입니다.' });
	}

	if (err.name === 'UserDosntExistError') {
		return res.status(401).json({ success: false, erroerMessage: '존재하지 않는 회원입니다.' });
	}
	if (err.name === 'PasswordIncorrectError') {
		return res.status(400).json({ success: false, erroerMessage: '비빌번호가 일치하지 않습니다.' });
	}
	if (err.name === 'UriIncorrectError') {
		return res.status(400).json({ success: false, erroerMessage: '주소를 올바르게 입력해 주세요.' });
	}
	if (err.name === 'InvalidTokenError') {
		return res.status(401).json({ success: false, erroerMessage: '사용할 수 없는 토큰입니다. 로그인을 해주세요.' });
	}
	if (err.name === 'AlreadyLoginError') {
		return res.status(401).json({ success: false, erroerMessage: '이미 로그인한 회원입니다.' });
	}
	if (err.name === 'ProductDosntExistError') {
		return res.status(404).json({ success: false, erroerMessage: '존재하지 않는 상품입니다.' });
	}
	if (err.name === 'NoPermissionError') {
		return res.status(401).json({ success: false, erroerMessage: '작성자가 아님으로 권한이 없습니다.' });
	}
	res.status(500).json({ success: false, erroerMessage: '연결에 실패하였습니다. 잠시후 다시 시도해 주세요.' });
};

module.exports = ErrorHandler;
