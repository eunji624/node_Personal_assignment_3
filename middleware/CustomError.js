class EmailExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'EmailExistError';
	}
}

class NickNameExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NickNameExistError';
	}
}

class UserDosntExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UserDosntExistError';
	}
}

class PasswordIncorrectError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PasswordIncorrectError';
	}
}

class UriIncorrectError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UriIncorrectError';
	}
}

class InvalidTokenError extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidTokenError';
	}
}

class AlreadyLoginError extends Error {
	constructor(message) {
		super(message);
		this.name = 'AlreadyLoginError';
	}
}

class ProductDosntExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ProductDosntExistError';
	}
}

class NoPermissionError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NoPermissionError';
	}
}

module.exports = {
	EmailExistError,
	NickNameExistError,
	UserDosntExistError,
	PasswordIncorrectError,
	UriIncorrectError,
	InvalidTokenError,
	AlreadyLoginError,
	ProductDosntExistError,
	NoPermissionError
};
