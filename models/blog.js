const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    author : {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    createAt: {
        type: Date,
        default:Date.now
    },
    context:String,
    image:String
})
 const Blog = mongoose.model("blog",blogSchema)
 module.exports = Blog