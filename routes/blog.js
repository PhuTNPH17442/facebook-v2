const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
router.post('/addStatus',blogController.upload.single('image'),blogController.addStatus)

module.exports = router