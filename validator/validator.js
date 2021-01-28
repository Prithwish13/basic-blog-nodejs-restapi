const {body} = require('express-validator');
const User = require('../models/User');

exports.formValidator =[
    body('title').trim().isLength({
        min:5
    }),
    body('content').trim().isLength({
        min:5
    })
]

exports.signupValidator = [
    body('name').trim().isLength({
        min:5
    }).withMessage('name should be of minimum 3 character long'),
    body('email').trim().normalizeEmail()
    .isEmail()
    .withMessage('Please Provide a valid email')
    .custom((value,{req})=>{
       return User.findOne({email:value})
            .then(userDoc=>{
                if(userDoc){
                    return Promise.reject('user already exists')
                }
            })
    }),
    body('password').trim().isLength({min:6})
]