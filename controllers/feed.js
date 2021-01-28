const {validationResult} = require('express-validator');
const { removeFile } = require('../helper/removefile');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = (req,res,next) =>{
    const currentPage = req.query.page || 1;
    const perPageValue = 2;
    let totalItem;
    Post.find()
        .countDocuments()
        .then(prodNum=>{
            totalItem= prodNum;
            return Post.find().skip((currentPage-1) * perPageValue).limit(perPageValue)
                
        })
        .then(posts=>{
            res.status(200).json({
                message:'post fatched successfully',
                posts:posts,
                totalItems:totalItem
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })    
};

exports.createPost = (req,res,next) => {
    const error = validationResult(req);
    console.log(req.file.path)
    if(!error.isEmpty()){
        const error = new Error('validation faild , please provide valid Input');
        error.statusCode = 422;
        throw error;
    };
    if(!req.file){
        const error = new Error('no image provided');
        error.statusCode=422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\","/");
    let creator;
    const post = new Post({
        title:title,
        content:content,
        imageUrl:imageUrl,
        creator:req.userId
    });

    post.save()
    .then(result=>{
       return User.findById(req.userId)

    })
    .then(user=>{
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 401;
            throw error;
        }
        creator=user;
        user.posts.push(post);
        return user.save();
        
    })
    .then(result=>{
        res.status(201).json({
        message:'Post created successfully',
        post:post,
        creator:{
            id:creator._id,
            name:creator.name
        }
        });
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statuseCode=500;
        }
        next(err);
    }) 
};

exports.getPost=(req,res,next)=>{
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post=>{
            if(!post){
                const error = new Error('Could not find any posts');
                error.statusCode(404);
                throw error;
            }
            res.status(200).json({
                messgae:'post fetched',
                post:post
            })
        })
        .catch(err=>{
            if(!err.statusCode){
            err.statuseCode=500;
            }
            next(err);
        })
};

exports.updatePost = (req,res,next) => {
    const postId = req.params.postId;
    const error = validationResult(req);
     if(!error.isEmpty()){
        const error = new Error('validation faild , please provide valid Input');
        error.statusCode = 422;
        throw error;
    }
    const {title,content} = req.body;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path.replace('\\','/');
    }
    if(!imageUrl){
        const error = new Error('No file Picked');
        error.statusCode= 422;
        throw error;
    }

    Post.findById(postId)
        .then(post=>{
            if(!post){
               let error = new Error('Could not find any posts');
               error.statusCode(404);
               throw error; 
            }
            if(post.creator.toString() !== req.userId){
                error = new Error('Not authorized')
                error.statusCode = 403;
                throw error;   
            }
            if(imageUrl!==post.imageUrl){
                removeFile(post.imageUrl);
            }            
            post.title=title;
            post.imageUrl=imageUrl;
            post.content=content;
            return post.save();
        })
        .then(result=>{
            res.status(200).json({
                message:'Post Updated',
                post:result
            })
        })
        .catch(err=>{
         if(!err.statusCode){
            err.statuseCode=500;
         }
        next(err);
        })
};

exports.removePost = (req,res,next) =>{
    const postId = req.params.postId;
    console.log(postId);
    Post.findById(postId)
        .then(post=>{
            //check Logged in user
            if(!post){
               let error = new Error('could not find any Post');
               error.statusCode=404;
               throw error; 
            }
             if(post.creator.toString() !== req.userId){
                error = new Error('Not authorized')
                error.statusCode = 403;
                throw error;   
            }
            console.log(post);
            removeFile(post.imageUrl);
            return Post.findByIdAndRemove(post._id)
        })
        .then(result=>{
           return User.findById(req.userId) 
        })
        .then(user=>{
            user.posts.pull(postId);
            return user.save();
        })
        .then(result=>{
            res.status(200)
                .json({message:'Post hasbeen Deleted'});
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })
}