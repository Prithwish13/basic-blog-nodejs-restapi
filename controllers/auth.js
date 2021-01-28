const User = require("../models/User");
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.singUp = (req,res,next) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        const err = new Error('validation faild');
        err.statusCode = 422;
        err.data = error.array();
        throw err;
    }
    const {name,email,password} = req.body;
    bcrypt.hash(password,12)
          .then(hashedPassword=>{
              const user = new User({
                  name:name,
                  email:email,
                  password:hashedPassword
              });
              return user.save()
          })
          .then(result=>{
              res.status(200).json({
                  message:'User created',
                  userId:result._id
              })
          })
          .catch(err=>{
            if(!err.statusCode){
             err.statusCode=500;
            }
            next(err);
          })
}

exports.login = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                const error = new Error('user not found');
                error.statusCode=401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password,user.password);
        })
        .then(isEqual=>{
            if(!isEqual){
                const error = new Error('Wrong password entered');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({email:loadedUser.email,userId:loadedUser._id.toString()},'secretPrithwish',{
                expiresIn:'1h'
            });

            res.status(200).json({
                token:token,
                userId:loadedUser._id.toString()
            })

        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}