var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');

//Database layer interactions
var databaseUGUR = require('../controllers/databaseUGURController.js');
var databaseAbstraction = require('../controllers/databaseAbstractionController.js');
var databaseTop = require ('../controllers/databaseTopController.js');







module.exports = router;