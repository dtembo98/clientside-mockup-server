const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { stringify } = require('querystring');

const UserSchema = new mongoose.Schema({
	description: {
		type: String,
		maxlength: 250,
		minlength: [5, 'A little bit more please'],
		default:
			'a little something about who you are, what you do and what your interests are will go a long way',
	},
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		],
		required: [true, 'We need your email too'],
		unique: true,
	},
	name: {
		type: String,
		maxlength: 30,
		minlength: 3,
		required: [true, 'PLease add a name'],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: [8, 'password should be atleast 8 characters long'],
		select: false,
	},
	website: {
		type: String,
		default: 'no-website',
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

//encrypting password
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//Sign  token and return
UserSchema.methods.getSignedJWToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

//match hashed password
UserSchema.methods.matchPassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

//generate/hash pass token
UserSchema.methods.getResetPassToken = function () {
	//gen token
	const resetToken = crypto.randomBytes(20).toString('hex');

	//hash token
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	//Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
