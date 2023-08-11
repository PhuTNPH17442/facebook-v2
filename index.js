const express = require('express')
const handlebar = require('express-handlebars')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const multer = require('multer')
const auth = require('./routes/auth')
const post = require('./routes/blog')
const friend = require('./routes/friend')
const User = require('./models/User')
const Friend = require('./models/friend')
const mine = require('./routes/status')
const path = require('path')
const { error } = require('console');
const Blog = require('./models/blog');
const app = express()
require('dotenv').config()
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended: true
}))
//mongoose
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb+srv://phu1203:12032001@cluster0.7krtu.mongodb.net/facebook', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    const db = mongoose.connection;
    db.on('error',(err)=>{
      console.log(err)
    })
    db.once('open', () => {
      console.log('MongoDB database connection established successfully');
    });
//checklogin
const checkLogin = (req, res, next) => {
  // Kiểm tra thông tin session hoặc token để xác định người dùng đã đăng nhập hay chưa
  const userId = req.session.userId; // Sử dụng thông tin từ session, bạn có thể thay bằng token nếu đang sử dụng cơ chế xác thực khác
  if (userId) {
    // Nếu đã đăng nhập, tiếp tục thực hiện request
    next();
  } else {
    // Nếu chưa đăng nhập, chuyển hướng đến trang login
    res.redirect('/login');
  }
};
//view engine
app.engine('hbs', handlebar.engine({
    extname: '.hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

//midle
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
//get routes
app.get('/',checkLogin, async(req, res) => {
  const userData = req.session.userData;
  const userId = req.session.userId;
    const blogs = await Blog.find().populate('author','username avatar').sort({createAt:-1}).exec()
    blogs.forEach(blog =>{
      blog.formattedDate = blog.createAt.toLocaleDateString();
    })
    const friendRq = await Friend.find({userId2:userId,status:"pending"}).populate('userId1','username avatar').exec()
    
    res.render('home', { title: "Home",userData,userId,blogs,friendRq })
})
app.get('/login', (req, res) => {
    res.render('login', { title: "Login" })
})
app.get('/register', (req, res) => {
    res.render('register', { title: "Register"})
})
app.get('/update',(req,res)=>{
  const userData = req.session.userData;
  const userId = req.session.userId
  console.log(userId)
  res.status(200).render('update',{userData,userId})
})
app.get('/ownProfile', (req, res) => {
    const userData = req.session.userData;
    // Check if the user is logged in
    res.render('ownProfile', { userData });
  });
  //multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('avatar'), async (req, res) => {
    if (!req.session.userData) {
        return res.status(401).send('Unauthorized');
      } 
    // Khi ảnh được upload thành công, lưu dữ liệu ảnh vào trường avatar của người dùng trong cơ sở dữ liệu
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Lưu trữ ảnh dạng base64 vào trường avatar của người dùng
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      user.avatar = base64Image;
      await user.save();
    }
    // Trả về thông báo thành công
    res.send('Upload thành công!');
  });
app.get('/listFriend', async(req,res)=>{
  const userData = req.session.userData;
  const userId = req.session.userId;
//   const friendRq = await Friend.find({$or: [
//     { userId1: userId, status: "accepted" },
//     { userId2: userId, status: "accepted" }
//   ]
// })
// .populate([
//   { path: 'userId1', select: 'username avatar' },
//   { path: 'userId2', select: 'username avatar' }
// ]).exec()
const friendRq = await Friend.find({userId1: userId,status:"accepted"}).populate("userId2","username avatar").exec();
const friendRq1 = await Friend.find({userId2:userId,status:"accepted"}).populate("userId1","username avatar").exec();
  res.render('myFriend',{title:"My Friend",userData,friendRq,friendRq1,userId})
})
app.use('/',auth)
app.use('/',post)
app.use('/',mine)
app.use('/',friend)
app.listen(3000, () => {
    console.log('localhost3000')
})