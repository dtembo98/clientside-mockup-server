const ErrorResponse = require('../utils/ErrorResponse');
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	//Cast error
	if (err.name === 'CastError') {
		const message = `${err.reason} ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	//duplicate error
	if (err.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(message, 400);
	}

	//Validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error',
	});
};

module.exports = errorHandler;
