const express = require('express')
const routes = express.Router()
routes.post('/message', async(req,res)=>{
    const  Sender = req.body.userSender; // Lấy dữ liệu từ máy khách
    const  Recipient = req.session.userId;
  // Xử lý dữ liệu ở đây (ví dụ: lưu trữ vào cơ sở dữ liệu)
   console.log(Sender,Recipient)
  // Phản hồi cho máy khách
  res.json({ message: "Dữ liệu đã được gửi thành công." });
})
module.exports = routes