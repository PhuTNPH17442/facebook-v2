const Friend = require('../models/friend')

const sendFriendReq = async(req,res,next)=>{
    const userId = req.session.userId
    const {userId2} = req.body
    // console.log(userId,userId2)
    if(userId){
        try {
            const existsFriend = await Friend.findOne({
                $or:[
                    { userId1: userId, userId2: userId2 },
                    { userId1: userId2, userId2: userId },
                ]
            })
            if(existsFriend){
                return res.status(400).json({message:"Đã gửi lời mời kết bạn với người này"})
            }
            const friendRequest = new Friend({
                userId1:userId,
                userId2:userId2,
                status:"pending"
            })
            await friendRequest.save();
            res.json({message:"Yêu cầu kết bạn đã được gửi đi "})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"lỗi"})
        }
    }else{
        console.log("Chưa đăng nhập")
    }
    
}
const processFriendRequest = async(req,res,next)=>{
    const userId = req.session.userId
    const {userId2,action }= req.query;
    // console.log(userId2,action)
    try {
        if(action === "accept"){
            try {
                const friendRq = await Friend.findOne({userId1:userId2,userId2:userId,status:"pending"})
                if(friendRq){
                    friendRq.status = "accepted"
            await friendRq.save();
            res.json({message:"Đã chấp nhận lời mời "})
                }else{
                    res.status(404).json({message:"Không có dữ liệu người dùng"})
                }
            } catch (error) {
                console.log(error)
            }           
        }else if (action === "delete") {
            // Thực hiện logic khi xóa lời mời kết bạn
            // Ví dụ: Xóa dòng dữ liệu khỏi CSDL
            await Friend.deleteOne({ userId1 }); 
        }
        // res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Lỗi"})
    }
}
const deleteFriend = async (req,res,next)=>{
    const userId2 = req.query.userId2
    const userId = req.session.userId
    console.log(userId2)
    try {
        await Friend.findOneAndDelete({
            $or:[
                { userId1: userId, userId2: userId2 },
                { userId1: userId2, userId2: userId },
            ]
        })
        res.send('Friend removed successfully')
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    sendFriendReq,processFriendRequest,deleteFriend
}