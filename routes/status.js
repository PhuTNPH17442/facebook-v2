const express = require('express')
const Router = express.Router()
const myStatusControl = require('../controllers/myStatusController')
Router.get('/myFace',myStatusControl.myStatus)

module.exports = Router