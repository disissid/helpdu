var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passport=require('passport');
var path = require('path');
var passportConfig = require('../configFiles/passportConfig.js');
var databaseUGUR = require('../controllers/databaseUGURController.js');


router.get('/',function(req,res){
	passportConfig.returnAuthStatus(req,function(returnedObject){
		if(returnedObject.code == 6){
			res.redirect(returnedObject.message);
		}
		else{
			res.sendFile(path.normalize(__dirname+'/../public/index.html'));
		}
	});
});

router.get('/search',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/search.html'));
});

router.post('/search',function(req,res){
	var subject = req.body.subject;
	tutorDB.find({'subjects':subject}).where('accountType').equals('1').select('tutorUID name tutorRatingPositive tutorRatingNegative tutorData instituteName fbData').exec(function(err,tutor){
		if(err){
			res.json({'code':4,'message':'Some Unexpected Error occureds'});
		}
		if(tutor){
			res.json(tutor);
		}
	});
});


router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/error',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/error.html'));
});

router.get('/subjectList',function(req,res){
	databaseUGUR.getSubjectList(function(subjectList){
		res.json(subjectList);
	});
});

router.get('/authenticationError',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/authentication-error.html'));
});

/*
//404 page
router.get('*',function(req,res){
	res.json("404 not found");
});
*/

mongoose.connect('mongodb://localhost:2001/helpdu'); //change this statement in the production version

module.exports = router;