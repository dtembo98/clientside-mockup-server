const express = require('express');
const app = express();
const PORT = process.env.port || 5000;
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const path = require('path');
const connectDB = require('./config/db');

app.use(morgan('tiny'));

//connect database
connectDB();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

app.use(cors());

app.use('/api/v1', authRoutes);

//error handling middleware
app.use(errorHandler);

//Spin server
const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} ON PORT ${PORT}`),
);

//handle unhandled rejections
process.on('unhandledRejection', (err, Promise) => {
	console.log(`Error: ${err.message}`);
	server.close(() => process.exit(1));
});
