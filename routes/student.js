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
	res.sendFile(path.normalize(__dirname+'/../public/student/lesson.html'));
});

//exports.buyHours=function(UID,isTutor,amount,callback){
router.get('/buyHours',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/student/buy-hours.html'));
});

router.get('/billing',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/student/billing.html'));
});	

router.get('/search',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/student/search.html'));
});	




//Hours have to be checked for validity here
//Check validity of everything in the route


module.exports = router;