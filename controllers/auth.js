const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(
			new ErrorResponse('please provide an email and password', 400),
		);
	}
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid login credentials', 401));
	}

	//check password
	const isPasswordMatch = await user.matchPassword(password);

	if (!isPasswordMatch) {
		return next(new ErrorResponse('Invalid login credentials', 401));
	}

	sendTokenResponse(user, 200, res);
});

//get token, create cookie
const sendTokenResponse = (user, statusCdode, res) => {
	const token = user.getSignedJWToken();
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
