const Blog = require('../models/blog')
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const addStatus = async (req,res,next)=>{
    const { context } = req.body;
    const image = req.file.buffer.toString('base64');
    const userId = req.session.userId
    try {
        const newBlog = new Blog({
            author: userId,
            context,
            image
        } 
        )
        await newBlog.save();
        res.send('success')
    } catch (error) {
        res.send(error)
    }
}


module.exports = {
    addStatus,upload
}