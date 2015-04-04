var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var databaseModels = require('../models/databaseModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');

//Database layer interactions
var databaseUGUR = require('../controllers/databaseUGURController.js');
var databaseAbstraction = require('../controllers/databaseAbstractionController.js');
var databaseTop = require ('../controllers/databaseTopController.js');

router.get('/lessonData',function(req,res){
	var tutorUID = req.session.passport.user.tutorUID;
	var tempModel = mongoose.model('Lesson'+tutorUID,databaseModels.lessonSchema,'Lesson'+tutorUID);
	tempModel.find({},'lessonUID subject fileLinks  createdTimestamp deadlineHours numberOfHours completed privatePublicKey',function(err,tutorLessonList){
		if(err){
			res.json({'code':'4','message':'Unexpected Error Occured'});
		}
		else{
			res.json(tutorLessonList);
		}
	});
});

router.get('/publicLessons',function(req,res){
	var tutorUID = req.session.passport.user.tutorUID;
	tutorDB.findOne({'tutorUID':tutorUID}, function(err,tutor){
		if(err){
			res.json({'code':4,'message':'Unexpected Error'});
		}
		if(tutor){
			var j;
			var subjects = tutor.subjects;
			var returningObject={};
			var flag = 0;

			for(j=0; j<subjects.length; j++){
				var tempModel = mongoose.model(subjects[j]+'Lesson',databaseModels.lessonSchema,subjects[j]+'Lesson');
				tempModel.find({'subject':subjects[j]}).where('privatePublicKey').equals('false').where('locked').equals('0').select('lessonUID subject fileLinks  createdTimestamp deadlineHours numberOfHours').exec(function(x,err,subjectLessonList){	
					if(err){
						flag++;
					}
					else{
						returningObject[subjects[x]] = subjectLessonList;
					}	
				}.bind(this,j)); //Ignore the warning now, have fixed the error now
			}
			if(flag === 0){
				res.json(returningObject);
			}
		}
	});
});

router.get('/walletData',function(req,res){
	UID = req.session.passport.user.tutorUID;
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
	UID = req.session.passport.user.tutorUID;
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

//Check subject before alloting the lesson




module.exports = router;