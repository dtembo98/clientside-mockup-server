const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', login);

module.exports = router;
