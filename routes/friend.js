const express = require('express')
const router = express.Router()
const friendController = require('../controllers/friendController')
router.post('/sendFriendRequest',friendController.sendFriendReq)
router.post('/processFriendRequest',friendController.processFriendRequest)
module.exports = router