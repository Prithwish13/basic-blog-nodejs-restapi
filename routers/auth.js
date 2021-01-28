const express = require('express');
const { singUp, login } = require('../controllers/auth');
const { signupValidator } = require('../validator/validator');
const router = express.Router();

router.put('/signup',signupValidator,singUp);
router.post('/login',login);

module.exports = router;