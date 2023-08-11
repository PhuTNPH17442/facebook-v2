const mongoose = require('mongoose')
const Schema = mongoose.Schema
const friendSchema = new Schema({
    userId1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: String,
})
const Friend = mongoose.model('Friend',friendSchema)
module.exports = Friend