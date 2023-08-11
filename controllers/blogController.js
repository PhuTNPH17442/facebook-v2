const Blog = require('../models/blog')
const User = require('../models/User')
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const addStatus = async (req,res,next)=>{
    const { context } = req.body;
    const image = req.file ? req.file.buffer.toString('base64') : null;
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

const getAuthorInfo = async (req, res) => {
  const { authorId } = req.query;

  try {
    // Truy vấn CSDL để lấy thông tin tác giả và các bài viết của tác giả
    const authorInfo = await User.findById(authorId);
    const blog = await Blog.find({ author: authorId }).populate("author", "username avatar description").sort({ createAt: -1 }).exec();

    if (authorInfo) {
      // console.log(typeof(authorInfo,blog))
      // // Gửi dữ liệu về cho client
      // res.json({ authorInfo, blog });
      res.render("personal", { title: "Author personal", authorInfo, blog });
    } else {
      res.status(404).json({ message: "Tác giả không tồn tại." });
    }
    // res.render('personal', { title: "AuthorPage", authorInfo: authorInfo, blog: blog });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server khi truy vấn CSDL." });
  }
  
}
// const renderPerson = async(req,res,next)=>{
//   const data = req.body; // Dữ liệu truyền từ client
//   // Render trang personal và truyền dữ liệu vào
//   res.render('personal', { data });
// }

module.exports = {
    addStatus,upload,getAuthorInfo
}