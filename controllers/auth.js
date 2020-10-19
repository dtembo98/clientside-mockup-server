const ErrorResponse = require('../utils/ErrorResponse');
const Merchant = require('../models/Merchant');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	console.log(req.body);
	const merchant = await Merchant.create({
		email: email,
		password,
	});

	sendTokenResponse(merchant, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	console.log(req.body);

	if (!email || !password) {
		return next(
			new ErrorResponse(
				'please provide an email address and password',
				400,
			),
		);
	}
	const merchant = await Merchant.findOne({ email: email }).select(
		'+password',
	);

	if (!merchant) {
		return next(new ErrorResponse('Invalid login credentials', 401));
	}

	//check password
	const isPasswordMatch = await merchant.matchPassword(password);

	if (!isPasswordMatch) {
		return next(new ErrorResponse('Invalid login credentials', 401));
	}

	sendTokenResponse(merchant, 200, res);
});

//get token, create cookie
const sendTokenResponse = (merchant, statusCdode, res) => {
	const token = merchant.getSignedJWToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCdode)
		.cookie('token', token, options)
		.json({ success: true, token });
};
