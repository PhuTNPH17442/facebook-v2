const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs');

const register = async (req, res, next) => {
  try {
    
    const { username, email, password } = req.body
    const errors = []
    if (!username) {
      errors.push('Username is required');
    }
    
    if (!email) {
      errors.push('Email is required');
    }
    
    if (!password) {
      errors.push('Password is required');
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      errors.push('Username or Email already exists')
    }
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Nếu có lỗi, chuyển hướng về trang đăng ký với mảng lỗi
    if (errors.length > 0) {
      return res.status(400).render('register', {title:"Register", errors });
    }
    
    // Đọc ảnh mặc định và chuyển đổi thành chuỗi base64
    const defaultAvatarPath = await path.join(__dirname, '../public/avatar.jpg');
    const defaultAvatar = await fs.readFileSync(defaultAvatarPath);
    const base64Image = await defaultAvatar.toString('base64');
    
    
    //hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    //new user
    const user = new User({ username, email, password: hashedPassword, avatar:base64Image , description: "hello everyone" })
    const userSaved = await user.save();

    // token 
    const token = jwt.sign({ userID: userSaved._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    req.session.userId = user._id;
    req.session.token = token;
    req.session.userData = { username: user.username, avatar: user.avatar,description:user.description }
    const userData = { username: user.username, avatar: user.avatar,description:user.description }
    res.status(200).redirect('/')
  } catch (error) {
    console.log(error)
    // res.status(500).redirect('/')
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = []

    // if (!email) {
    //   errors.push('Email is required');
    // }
    
    // if (!password) {
    //   errors.push('Password is required');
    // }
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      errors.push("Email không tồn tại");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        errors.push("Email hoặc mật khẩu không đúng");
      }
    }

    if(errors.length>0){
      return res.status(400).render('login', {title:"Login", errors });
    }
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    // const base64String = user.avatar.toString('base64');
    req.session.userId = user._id;
    req.session.token = token;
    req.session.userData = { username: user.username, avatar: user.avatar,description:user.description }
    const userData = { username: user.username, avatar: user.avatar,description:user.description }
    // res.status(200).json(token)
    res.status(200).redirect('/')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
};
const update = async(req,res,next)=>{
  try {
    const {userId} = req.session;
    const{username,description} = req.body;
    const user = await User.findByIdAndUpdate(userId,{username,description},{new:true});
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    res.status(200).json({message:"success"})
  } catch (error) {
    console.log(error)
  }
}
const logout = async (req, res, next) => {
  req.session.userId = null;
  req.session.token = null;

  // Chuyển hướng người dùng về trang chính hoặc trang đăng nhập
  res.redirect('/');
}
module.exports = {
  register, login, logout,update
}