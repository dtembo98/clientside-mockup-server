const express = require('express')
const router = express.Router()
const { postLogin,getLogin} = require('../controllers/auth')

router.get('/login',getLogin)
router.post('/login',postLogin)

module.exports = router;