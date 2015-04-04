var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');
var databaseModels = require('../models/databaseModels.js');

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
	//Write get query here instead of using this.
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
	UID = req.session.passport.user.studentUID;
	var tempModel = mongoose.model('WalletLedger'+UID,databaseModels.specificLedgerSchema,'WalletLedger'+UID);
	tempModel.find({}).select('transactionType transactionComment createdTimestamp transactionAccount debitAmount creditAmount').exec(function(err,record){
			if(err){
				res.json({'code':4, 'message':'Unexpected error occured'});
			}
			else{
				res.json({'code':7,'message':record});
			}
	});
});

router.get('/financeData',function(req,res){
	UID = req.session.passport.user.studentUID;
	var tempModel = mongoose.model('FinanceLedger'+UID,databaseModels.specificLedgerSchema,'FinanceLedger'+UID);
	tempModel.find({}).select('transactionType transactionComment createdTimestamp transactionAccount debitAmount creditAmount').exec(function(err,record){
		if(err){
			res.json({'code':4, 'message':'Unexpected error occured'});
		}
		else{
			res.json({'code':7,'message':record});
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

router.post('/lessonPageData',function(req,res){
	var lessonUID = req.body.lessonUID;
	var studentUID = req.session.passport.user.studentUID;
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	tempModel.findOne({'lessonUID':lessonUID},function(err,studentLesson){
		if(err){
			res.json({'code':'4','message':'Unexpected Error'});
		}
		if(!studentLesson){
			res.json({'code':'12','message':'Lesson not found'});
		}
		else{
			res.json({'code':'7','message':studentLesson});
		}
	});
});

//Add required fields in future as required
router.post('/getTutorDetails',function(req,res){
	var tutorUID = req.body.tutorUID;
	tutorDB.findOne({'tutorUID':tutorUID}).where('accountType').equals('1').select('name').exec(function(err,tutor){
		if(err){
			res.json({'code':4,'message':'Some Unexpected Error occureds'});
		}
		if(!tutor){
			res.json({'code':13,'message':'Tutor not found'});
		}
		if(tutor){
			res.json({'code':7,'message':tutor});
		}
	});
});

//exports.reviewLesson=function(studentUID,studentName,tutorUID,lessonUID,tutorRating,tutorReview,callback){
router.post('/postReview',function(req,res){
	var studentUID = req.session.passport.user.studentUID;
	var lessonUID = req.body.lessonUID;
	var subject = req.body.subject;
	var tutorUID = req.body.tutorUID;
	var tutorRating = req.body.tutorRating;
	var tutorReview = req.body.tutorReview;
	if(tutorRating == 'true' || tutorRating == 'false'){
		completedLessonModel.findOne({'lessonUID':lessonUID}).where('studentUID').equals(studentUID).exec(function(err,completedLesson){
			if(err){
				res.json({'code':'4','message':'Unexpected Error'});
			}
			if(!completedLesson){
				res.json({'code':'12','message':'Lesson not found'});
			}
			if(completedLesson && completedLesson.isReviewed === false){
				studentDB.findOne({'studentUID':studentUID}).select('name').exec(function(err,student){
					if(err){
						res.json({'code':4,'message':'Some Unexpected Error occureds'});
					}
					if(student){
						var studentName = student.name;
						databaseAbstraction.reviewLesson(studentUID,studentName,tutorUID,lessonUID,tutorRating,tutorReview,function(returnedObject){
							if(returnedObject.code == 7){
								res.json({'code':7,'message':'Successfully added the review'});
							}
							else if(returnedObject.code == 4){
								res.json({'code':4,'message':'Some unexpected error occured'});
							}
						});
					}
				});
			}
		});
	}
});

router.post('/checkReviewStatus',function(req,res){
	var studentUID = req.session.passport.user.studentUID;
	var lessonUID = req.body.lessonUID;
	completedLessonModel.findOne({'lessonUID':lessonUID}).where('studentUID').equals(studentUID).select('isReviewed tutorReview tutorRating').exec(function(err,completedLesson){
		console.log(completedLesson);
		if(err){
			res.json({'code':4,'message':'Unexpected Error'});
		}
		if(!completedLesson){
			res.json({'code':12,'message':'Lesson not found'});
		}
		if(completedLesson){
			res.json({'code':7,'message':completedLesson});
		}
	});
});


//exports.flagLesson=function(studentUID,tutorUID,lessonUID,callback){
router.post('/flagLesson',function(req,res){
	var lessonUID = req.body.lessonUID;
	var tutorUID = req.body.tutorUID;
	var studentUID = req.session.passport.user.studentUID;
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	tempModel.findOne({'lessonUID':lessonUID},function(err,studentLesson){
		if(err){
			res.json({'code':'4','message':'Unexpected Error'});
		}
		if(!studentLesson){
			res.json({'code':'12','message':'Lesson not found'});
		}
		else{
			databaseAbstraction.flagLesson(studentUID,tutorUID,lessonUID,function(returnedObject){
				if(returnedObject.code == 7){
					res.json({'code':7,'message':'Successfully flagged the lesson'});
				}
				else if(returnedObject.code == 4){
					res.json({'code':4,'message':'Some unexpected error occured'});
				}
			});
		}
	});
});

module.exports = router;