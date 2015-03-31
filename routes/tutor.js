var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');



router.get('/lesson',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/tutor/lesson.html'));
});

router.get('/billing',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/tutor/billing.html'));
});	



//Hours have to be checked for validity here
//Check validity of everything in the route


module.exports = router;