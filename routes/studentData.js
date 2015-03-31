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


router.post('/buyHours',function(req,res){

	var studentUID = req.session.passport.user.studentUID;
	var numberOfHours = req.body.numberOfHours;
	databaseTop.buyHours(studentUID,'false',numberOfHours,function(returnedObject){
		res.json(returnedObject);
	});
});

router.get('/lessonData',function(req,res){
	databaseUGUR.getStudentLesson(req.session.passport.user.studentUID,{},function(returnedObject){
		if(returnedObject.code == 1){
			res.json(returnedObject);
		}
		else if(returnedObject.code == 4){
			res.json({'code':4, 'message':returnedObject.message});
		}
	});
});

router.post('/uploadLesson',function(req,res){
	//exports.uploadLessonTop=function(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
	var subject = req.body.subject;
	var message = req.body.message;
	var fileLinks = req.body.fileLinks;
	var deadlineHours = req.body.deadlineHours;
	var numberOfHours = req.body.numberOfHours;
	var privatePublicKey = req.body.privatePublicKey;
	var studentUID = req.session.passport.user.studentUID;
	if(numberOfHours >= 1){

		if(privatePublicKey == 'false'){
			databaseTop.uploadLessonTop(studentUID,'false',subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
				res.json(returnedObject);
			});			
		}
		else if(privatePublicKey == 'true'){
			var tutorUID = req.body.tutorUID;
			databaseTop.uploadLessonTop(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,function(returnedObject){
				res.json(returnedObject);
			});
		}
	}
	else{
		res.json({'code': 4, 'message':'Number of hours need to be more than one'});
	}
});


router.get('/walletData',function(req,res){
	databaseUGUR.getSpecificWalletLedger(req.session.passport.user.studentUID,{},function(returnedObject){
		if(returnedObject.code == 1){
			res.json(returnedObject);
		}
		else if(returnedObject.code == 4){
			res.json({'code':4, 'message':returnedObject.message});
		}
	});
});

router.get('/financeData',function(req,res){
	databaseUGUR.getSpecificFinanceLedger(req.session.passport.user.studentUID,{},function(returnedObject){
		if(returnedObject.code == 1){
			res.json(returnedObject);
		}
		else if(returnedObject.code == 4){
			res.json({'code':4, 'message':returnedObject.message});
		}
	});
});

//exports.getCurrentUIDWallet = function(searchObject,callback){
router.get('/walletBalance',function(req,res){
	databaseUGUR.getCurrentUIDWallet({'UID':req.session.passport.user.studentUID},function(returnedObject){
		if(returnedObject.code == 4){
			res.json({'code':4, 'message':returnedObject.message});
		}
		else{
			res.json(returnedObject);
		}
	});
});



module.exports = router;