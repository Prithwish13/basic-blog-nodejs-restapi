require('dotenv').config();
const express = require('express');
const app = express();
const feedRouter = require('./routers/feed');
const authRoute = require('./routers/auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const port =  process.env.PORT || 4000;
const MONGODB_URI=process.env.MONGO_URI;
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(req.error){
        cb(null,false)
    }else if (file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg') {
        cb(null,true)
    } else {
        cb(null,false)
    }
}

app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));

app.use(cors());

app.use('/feed',feedRouter);
app.use('/auth',authRoute);
app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode||500;
    const message = error.message;
    const errData = error.data;
    res.status(status).json({
        message:message,
        data:errData
    })
})

mongoose.connect(MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
        .then(result=>{
            app.listen(port,()=>{
                console.log('app is running');
            });
            console.log('Database connected successfully')
        }).catch(err=>{
            console.log(err);
        })

