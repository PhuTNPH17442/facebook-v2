const Blog = require('../models/blog')

const myStatus = async(req,res)=>{
    const userId = req.session.userId;
    const userData = req.session.userData;
    const blog = await Blog.find({author : userId}).populate('author','username avatar description').sort({createAt :-1}).exec()
    blog.forEach(blog =>{
        blog.formattedDate = blog.createAt.toLocaleDateString();
      })
    res.render('myStatus',{title:"My Status",userData,blog}) 
}
module.exports ={
    myStatus
}