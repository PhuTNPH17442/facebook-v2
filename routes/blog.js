const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
router.post('/addStatus',blogController.upload.single('image'),blogController.addStatus)
router.get('/getAuthorInfo',blogController.getAuthorInfo)
// router.post('/renderPersonal',blogController.renderPerson)
module.exports = router