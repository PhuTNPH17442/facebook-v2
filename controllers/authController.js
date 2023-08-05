const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs');

const register = async (req, res, next) => {
  try {
    
    const { username, email, password } = req.body
    
    const userExists = await User.findOne({ email, username });
    if (userExists) {
      return res.status(400).json({
        message: 'Email or Phone already exists'
      })
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
    const userData = { username: user.username, avatar: user.avatar }
    res.status(200).render('home', { userData, token })
  } catch (error) {
    res.status(500).redirect('/')
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
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
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);

    // Remove token from blacklist or database if necessary

    // Respond with success message
    res.json({ msg: 'User logged out successfully' });
  } catch (err) {
    // Respond with error message
    res.status(500).json({ msg: 'Server error' });
  }
}
module.exports = {
  register, login, logout,update
}