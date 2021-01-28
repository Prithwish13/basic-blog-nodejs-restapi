const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        //required:true
        default:'I am new user'
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }]
},{timestamps:true})

module.exports = mongoose.model('User',UserSchema);