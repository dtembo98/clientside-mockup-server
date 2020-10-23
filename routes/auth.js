const express = require('express');
const router = express.Router();
const { login, register, getMerchants } = require('../controllers/auth');
const { protect } = require('../middleware/auth.middleware');

router.route('/login').post(login);
router.route('/signup').post(register);
router.route('/').get(getMerchants);

module.exports = router;
