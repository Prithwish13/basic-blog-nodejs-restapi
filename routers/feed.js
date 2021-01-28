const express = require('express');
const router = express.Router();
const {createPost,getPosts,getPost,updatePost,removePost} = require('../controllers/feed');
const { formValidator } = require('../validator/validator');
const isAuth = require('../middleware/is-auth');

router.get('/posts',isAuth,getPosts);
router.post('/post',formValidator,isAuth,createPost);
router.get('/post/:postId',isAuth,getPost);
router.put('/post/:postId',formValidator,isAuth,updatePost);
router.delete('/post/:postId',isAuth,removePost);

module.exports= router;