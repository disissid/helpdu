var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');


router.get('/fillDetails',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/newTutor/fill-details.html'));
});


//Hours have to be checked for validity here
//Check validity of everything in the route


module.exports = router;