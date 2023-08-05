const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    username : {
        type:String,
        unique:true,
        index:true
    }, 
    email : {
        type:String,
        unique:true,
        index:true
    },
    password:{
        type:String
    },
    description:{
        type:String
    },
    avatar:{
        type:String
    },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
    // avatarType:{
    //     type:String
    // }

},{timestamps:true})

const User = mongoose.model('User',userSchema)
module.exports = User