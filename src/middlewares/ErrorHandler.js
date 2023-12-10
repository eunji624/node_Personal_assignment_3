const ErrorHandler = (err, req, res, next) => {
	console.log('에러헨들러 미들웨어 구동중', err.message);
	switch (err.message) {
		case '회원정보가 없음으로 접근할 수 없습니다.':
			return res.status(401).json({ erroerMessage: err.message });

		case '이미 존재하는 이메일 입니다.':
			return res.status(409).json({ erroerMessage: err.message });

		case '이미 로그인한 회원입니다.':
			return res.status(403).json({ erroerMessage: err.message });

		case '로그인을 해주세요.':
			return res.status(401).json({ erroerMessage: err.message });

		case '수정 권한이 없습니다.':
			return res.status(401).json({ erroerMessage: err.message });

		case '해당하는 상품글이 존재하지 않습니다.':
			return res.status(404).json({ erroerMessage: err.message });

		case '올바른 주소값이 아닙니다.':
			return res.status(404).json({ erroerMessage: err.message });

		case '회원가입을 해주세요.':
			return res.status(401).json({ erroerMessage: err.message });

		case '비밀번호가 일치하지 않습니다.':
			return res.status(401).json({ erroerMessage: err.message });

		case '닉네임을 입력해 주세요.':
			return res.status(400).json({ erroerMessage: err.message });

		case '이메일을 확인해 주세요.':
			return res.status(400).json({ erroerMessage: err.message });

		case '비밀번호를 입력해 주세요':
			return res.status(400).json({ erroerMessage: err.message });

		case '비밀번호는 6자리 이상이여야 합니다.':
			return res.status(400).json({ erroerMessage: err.message });

		case '상품명을 입력해 주세요.':
			return res.status(400).json({ erroerMessage: err.message });

		case '가격을 입력해 주세요.':
			return res.status(400).json({ erroerMessage: err.message });

		case '내용을 입력해 주세요.':
			return res.status(400).json({ erroerMessage: err.message });

		default:
			return res
				.status(500)
				.json({ success: false, erroerMessage: '연결에 실패하였습니다. 잠시후 다시 시도해 주세요.' });
	}
};

export default ErrorHandler;
