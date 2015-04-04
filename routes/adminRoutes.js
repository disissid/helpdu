var express = require('express');
var router = express.Router();
var databaseAPIController = require('../controllers/databaseUGURController.js');
var databaseAbstractionController = require('../controllers/databaseAbstractionController.js');
var databaseTopController = require('../controllers/databaseTopController.js');
var studentController = require('../controllers/studentController.js');
var tutorController = require('../controllers/tutorController.js');

/*Admin Panel routes*/

var admin=require('../controllers/adminController.js');

/*Subject Methods*/

router.get('/addSubject/:subject',function(req,res){
	var subjectName = req.params.subject;
	admin.addSubject(subjectName,function(status){
		res.json(status);
	});
});

router.get('/removeSubject/:subject', function(req,res){
	var subjectName = req.params.subject;
	admin.removeSubject(subjectName,function(status){
		//Do stuff here that needs to be done when an admin removes a file
		res.json(status);
	});
});

router.get('/subjectList',function(req,res){
	admin.getSubjectList(function(list){
		res.json(list);
	});
});

//Imp remove this route as soon as possible. Major vunerability
router.get('/createNewAdmin/:name/:email/:password',function(req,res){
	admin.newAdmin(req.params.name, req.params.email, req.params.password, function(receivedObject){
		res.json(receivedObject);
	});
});


//Test Routes  (Delete After Use)
//uploadCompletedLesson
router.get('/completedLesson/upload/:lessonUID/:subject/:pickupFromSubjectDb',function(req,res){
	databaseAPIController.uploadCompletedLesson(req.params.lessonUID,req.params.subject,function(result){
		res.json(result);
	});
});
//removeCompletedLesson
router.get('/completedLesson/remove/:lessonUID',function(req,res){
	databaseAPIController.removeCompletedLesson(req.params.lessonUID,function(result){
		res.json(result);
	});
});

//updateCompletedLesson
router.get('/completedLesson/update/:lessonUID/:tutorRating/:tutorReview/:flaggedLesson',function(req,res){
	databaseAPIController.updateCompletedLesson(req.params.lessonUID,req.params.tutorRating,req.params.tutorRating,req.params.flaggedLesson,function(result){
		res.json(result);
	});
});
//getCompletedLesson
router.get('/getCompletedLesson/:searchObject',function(req,res){
	databaseAPIController.getCompletedLesson(req.params.searchObject,function(result){
		res.json(result);
	});
});
//uploadStudentLesson
router.get('/StudentLesson/upload/:lessonUID/:studentUID/:tutorUID/:subject/:message/:fileLinks/:deadlineHours/:numberOfHours/:privatePublicKey',function(req,res){
	databaseAPIController.uploadStudentLesson(req.params.lessonUID,req.params.studentUID,req.params.tutorUID,req.params.subject,req.params.message,req.params.fileLinks,req.params.deadlineHours,req.params.numberOfHours,req.params.privatePublicKey,function(result){
		res.json(result);
	});
});
//updateStudentLesson -- checked
//Sample : checked via proxy, i.e. checked the update subject lesson
router.get('/StudentLesson/update/:studentUID/:lessonUID/:studentUID/:tutorUID/:locked/:lockTime/:unlockTime/:solutionLinks/:completed',function(req,res){
	databaseAPIController.updateStudentLesson(req.params.studentUID,req.params.lessonUID,req.params.tutorUID,req.params.locked,req.params.lockTime,req.params.unlockTime,req.params.solutionLinks,req.params.completed,function(result){
		res.json(result);
	});
});
//removeStudentLesson -- checked
router.get('/StudentLesson/remove/:studentUID/:lessonUID',function(req,res){
	databaseAPIController.removeStudentLesson(req.params.studentUID,req.params.lessonUID,function(result){
		res.json(result);
	});
});
//getStudentLesson -- checked
router.get('/getStudentLesson/:studentUID/:searchObject',function(req,res){
	databaseAPIController.getStudentLesson(req.params.studentUID,req.params.searchObject,function(result){
		res.json(result);
	});
});
//uploadTutorLesson -- checked
router.get('/TutorLesson/upload/:lessonUID/:studentUID/:tutorUID/:subject/:message/:fileLinks/:deadlineHours/:numberOfHours/:privatePublicKey',function(req,res){
	databaseAPIController.uploadTutorLesson(req.params.lessonUID,req.params.studentUID,req.params.tutorUID,req.params.subject,req.params.message,req.params.fileLinks,req.params.deadlineHours,req.params.numberOfHours,req.params.privatePublicKey,function(result){
		res.json(result);
	});
});

//updateTutorLesson -- checked
// //Sample : checked via proxy, i.e. checked the update subject lesson
router.get('/TutorLesson/update/:tutorUID/:lessonUID/:locked/:lockTime/:unlockTime/:solutionLinks/:completed',function(req,res){
	databaseAPIController.updateTutorLesson(req.params.lessonUID,req.params.tutorUID,req.params.locked,req.params.lockTime,req.params.unlockTime,req.params.solutionLinks,req.parmas.completed,function(result){
		res.json(result);
	});
});
//getTutorLesson -- checked (Check to do)
router.get('/getTutorLesson/:tutorUID/:searchObject',function(req,res){
	databaseAPIController.getTutorLesson(req.params.tutorUID,req.params.searchObject,function(result){
		res.json(result);
	});
});
//uploadSubjectLesson -- checked
router.get('/SubjectLesson/upload/:lessonUID/:studentUID/:tutorUID/:subject/:message/:fileLinks/:deadlineHours/:numberOfHours/:privatePublicKey',function(req,res){
	databaseAPIController.uploadSubjectLesson(req.params.lessonUID,req.params.studentUID,req.params.tutorUID,req.params.subject,req.params.message,req.params.fileLinks,req.params.deadlineHours,req.params.numberOfHours,req.params.privatePublicKey,function(result){
		res.json(result);
	});
});

//updateSubjectLesson -- checked
// Sample : http://localhost:666/SubjectLesson/update/physics/lessonUID/tutorUID/1/false/false/false/true
router.get('/SubjectLesson/update/:subject/:lessonUID/:tutorUID/:locked/:lockTime/:unlockTime/:solutionLinks/:completed',function(req,res){
	databaseAPIController.updateSubjectLesson(req.params.subject,req.params.lessonUID,req.params.tutorUID,req.params.locked,req.params.lockTime,req.params.unlockTime,req.params.solutionLinks,req.params.completed,function(result){
		res.json(result);
	});
});
//removeSubjectLesson -- checked
router.get('/SubjectLesson/remove/:subject/:lessonUID',function(req,res){
	databaseAPIController.removeSubjectLesson(req.params.lessonUID,req.params.subject,function(result){
		res.json(result);
	});
});
//getSubjectLesson -- checked
router.get('/getSubjectLesson/:subject/:searchObject',function(req,res){
	databaseAPIController.getSubjectLesson(req.params.subject,req.params.searchObject,function(result){
		res.json(result);
	});
});
//uploadSubjectTimetracker -- checked
router.get('/SubjectTimetracker/upload/:subject/:lessonUID',function(req,res){
	databaseAPIController.uploadSubjectTimeTracker(req.params.subject,req.params.lessonUID,function(result){
		res.json(result);
	});
});

//updateSubjectTimetracker -- checked
router.get('/SubjectTimetracker/update/:subject/:lessonUID/:tutorUID/:locked/:lockTime/:unlockTime',function(req,res){
	databaseAPIController.updateSubjectTimeTracker(req.params.lessonUID,req.params.subject,req.params.tutorUID,req.params.locked,req.params.lockTime,req.params.unlockTime,function(result){
		res.json(result);
	});
});

//uploadFinanceJournal - checked
//Sample : http://localhost:666/uploadFinanceJournal/1/wallet/false/''/helpdu/ishan/100/false/false
router.get('/uploadFinanceJournal/:transactionUID/:transactionType/:lessonUID/:transactionComment/:debitAccount/:creditAccount/:amount/:blocked/:isReversed',function(req,res){
	databaseAPIController.uploadFinanceJournal(req.params.transactionUID,req.params.transactionType,req.params.lessonUID,req.params.transactionComment,req.params.debitAccount,req.params.creditAccount,req.params.amount,req.params.blocked,req.params.isReversed,function(result){
		res.json(result);
	});
});

//uploadWalletJournal -- checked
//Sample : http://localhost:666/uploadWalletJournal/1/wallet/false/''/ishan/helpdu/5/false
router.get('/uploadWalletJournal/:transactionUID/:transactionType/:lessonUID/:transactionComment/:debitAccount/:creditAccount/:amount/:blocked',function(req,res){
	databaseAPIController.uploadWalletJournal(req.params.transactionUID,req.params.transactionType,req.params.lessonUID,req.params.transactionComment,req.params.debitAccount,req.params.creditAccount,req.params.amount,req.params.blocked,function(result){
		res.json(result);
	});
});


//uploadSpecificFinanceLedger -- checked
//Sample : http://localhost:666/uploadSpecificFinanceLedger/1/wallet/ishan/false/''/helpdu/0/100/false
router.get('/uploadSpecificFinanceLedger/:transactionUID/:transactionType/:UID/:lessonUID/:transactionComment/:transactionAccount/:debitAmount/:creditAmount/:blocked',function(req,res){
	databaseAPIController.uploadSpecificFinanceLedger(req.params.transactionUID,req.params.transactionType,req.params.UID,req.params.lessonUID,req.params.transactionComment,req.params.transactionAccount,req.params.debitAmount,req.params.creditAmount,req.params.blocked,function(result){
		res.json(result);
	});
});

//uploadSpecificWalletLedger -- checked
//Sample : http://localhost:666/uploadSpecificWalletLedger/1/wallet/ishan/false/'none'/helpdu/5/0/false
router.get('/uploadSpecificWalletLedger/:transactionUID/:transactionType/:UID/:lessonUID/:transactionComment/:transactionAccount/:debitAmount/:creditAmount/:blocked',function(req,res){
	databaseAPIController.uploadSpecificWalletLedger(req.params.transactionUID,req.params.transactionType,req.params.UID,req.params.lessonUID,req.params.transactionComment,req.params.transactionAccount,req.params.debitAmount,req.params.creditAmount,req.params.blocked,function(result){
		res.json(result);
	});
});


//updateCurrentUIDWallet -- Checked
// Sample : http://localhost:666/updateCurrentUIDWallet/ishan/false/5
router.get('/updateCurrentUIDWallet/:UID/:isTutor/:addBalance',function(req,res){
	databaseAPIController.updateCurrentUIDWallet(req.params.UID,req.params.isTutor,req.params.addBalance,function(result){
		res.json(result);
	});
});

//uploadCurrentUIDWallet -- Checked
//Sample : http://localhost:666/uploadcurrentUIDWallet/ishan/false
router.get('/uploadcurrentUIDWallet/:UID/:isTutor',function(req,res){
	databaseAPIController.uploadCurrentUIDWallet(req.params.UID,req.params.isTutor,function(result){
		res.json(result);
	});
});

//exports.getObsoleteLessons=function(subject,callback){
//Sample : http://localhost:666/getObsoleteLessons/physics
router.get('/getObsoleteLessons/:subject',function(req,res){
	databaseAPIController.getObsoleteLessons(req.params.subject,function(result){
		res.json(result);
	});
});


//uploadNotification -- checked
// Sample : http://localhost:666/uploadNotification/ishan/1/123/hemant/hemant
router.get('/uploadNotification/:UID/:notificationType/:notificationUID/:notificationFromUID/:notificationFromName',function(req,res){
	databaseAPIController.uploadNotification(req.params.UID,req.params.notificationType,req.params.notificationUID,req.params.notificationFromUID,req.params.notificationFromName,function(result){
		res.json(result);
	});
});

//getNotification -- checked
// Sample : http://localhost:666/getNotification/ishan
router.get('/getNotification/:UID',function(req,res){
	databaseAPIController.getNotification(req.params.UID,function(result){
		res.json(result);
	});
});

//removeNotification -- checked
// Sample : http://localhost:666/removeNotification/ishan/1
router.get('/removeNotification/:UID/:notificationUID',function(req,res){
	databaseAPIController.removeNotification(req.params.UID,req.params.notificationUID,function(result){
		res.json(result);
	});
});


//uploadMessage -- checked
// Sample : http://localhost:666/uploadMessage/ishan/1/hemant/hello/hemant
router.get('/uploadMessage/:UID/:messageUID/:messageFromUID/:message/:messageFromName',function(req,res){
	databaseAPIController.uploadMessage(req.params.UID,req.params.messageUID,req.params.messageFromUID,req.params.message,req.params.messageFromName,function(result){
		res.json(result);
	});
});

//getMessage -- checked
// Sample : http://localhost:666/getMessage/ishan
router.get('/getMessage/:UID',function(req,res){
	databaseAPIController.getMessage(req.params.UID,function(result){
		res.json(result);
	});
});


//removeMessage -- checked
// Sample : http://localhost:666/removeMessage/ishan/1
router.get('/removeMessage/:UID/:messageUID',function(req,res){
	databaseAPIController.removeMessage(req.params.UID,req.params.messageUID,function(result){
		res.json(result);
	});
});


//Abstraction Layer Routes

//exports.addHoursWallet = function(UID,isTutor,amount,exchangeRate,transactionType,callback){ Broken
//Sample : http://localhost:666/addHoursWallet/ishan/false/5/20  
router.get('/addHoursWallet/:UID/:isTutor/:amount/:exchangeRate',function(req,res){
	databaseAbstractionController.addHoursWallet(req.params.UID,req.params.isTutor,req.params.amount,req.params.exchangeRate,function(result){
		res.json(result);
	});
});


//uploadLessonAbstract -- checked
//Sample : http://localhost:666/uploadLessonAbstract/ishan/false/physics/'Something'/'nothing'/10/2/false : public lesson
//		   http://localhost:666/uploadLessonAbstract/ishan/hemant/physics/'Something'/'nothing'/10/2/true : private lesson
router.get('/uploadLessonAbstract/:studentUID/:tutorUID/:subject/:message/:fileLinks/:deadlineHours/:numberOfHours/:privatePublicKey',function(req,res){
	databaseAbstractionController.uploadLessonAbstract(req.params.studentUID,req.params.tutorUID,req.params.subject,req.params.message,req.params.fileLinks,req.params.deadlineHours,req.params.numberOfHours,req.params.privatePublicKey,function(result){
		res.json(result);
	});
});


//removeHoursWallet  -- checked
//Sample : http://localhost:666/removeHoursWallet/ishan/false/5
router.get('/removeHoursWallet/:UID/:isTutor/:amount',function(req,res){
	databaseAbstractionController.removeHoursWallet(req.params.UID,req.params.isTutor,req.params.amount,function(result){
		res.json(result);
	});
});

//assignTutor -- checked
//Sample : http://localhost:666/assignTutor/lessonUID/hemant/physics
router.get('/assignTutor/:lessonUID/:tutorUID/:subject',function(req,res){
	databaseAbstractionController.assignTutor(req.params.lessonUID,req.params.tutorUID,req.params.subject,function(result){
		res.json(result);
	});
});

//uploadSolutionLessonAbstract -- checked
//Sample : http://localhost:666/uploadSolutionLessonAbstract/lessonUID/physics/someSolution
router.get('/uploadSolutionLessonAbstract/:lessonUID/:subject/:solutionLinks',function(req,res){
	databaseAbstractionController.uploadSolutionLessonAbstract(req.params.lessonUID,req.params.subject,req.params.solutionLinks,function(result){
		res.json(result);
	});
});

//unassignTutorAbstract -- checked
//Sample : http://localhost:666/unassignTutorAbstract/lessonUID/physics
router.get('/unassignTutorAbstract/:lessonUID/:subject',function(req,res){
	databaseAbstractionController.unassignTutorAbstract(req.params.lessonUID,req.params.subject,function(result){
		res.json(result);
	});
});

//completedLessonsAbstract -- checked
//Sample : http://localhost:666/completedLessonAbstract/lessonUID/physics
router.get('/completedLessonAbstract/:lessonUID/:subject',function(req,res){
	databaseAbstractionController.completedLessonAbstract(req.params.lessonUID,req.params.subject,function(result){
		res.json(result);
	});
});

//addHoursCompletedLesson -- checked
//Sample : http://localhost:666/addHoursCompletedLesson/lessonUID  
router.get('/addHoursCompletedLesson/:lessonUID',function(req,res){
	databaseAbstractionController.addHoursCompletedLesson(req.params.lessonUID,function(result){
		res.json(result);
	});
});

//removeLessonAbstract -- checked
//Sample : http://localhost:666/removeLessonAbstract/lessonUID/physics
router.get('/removeLessonAbstract/:lessonUID/:subject',function(req,res){
	databaseAbstractionController.removeLessonAbstract(req.params.lessonUID,req.params.subject,function(result){
		res.json(result);
	});
});

//reviewLesson -- 
//exports.reviewLesson=function(studentUID,studentName,tutorUID,lessonUID,tutorRating,tutorReview
//Sample : http://localhost:666/reviewLesson/lessonUID/studentUID/studentName/tutorUID/lessonUID/tutorRating/tutorReview
router.get('/reviewLesson/:studentUID/:studentName/:tutorUID/:lessonUID/:tutorRating/:tutorReview',function(req,res){
	databaseAbstractionController.reviewLesson(req.params.studentUID,req.params.studentName,req.params.tutorUID,req.params.lessonUID,req.params.tutorRating,req.params.tutorReview,function(result){
		res.json(result);
	});
});

//flagLesson -- checked
//Sample : http://localhost:666/flagLesson/lessonUID
router.get('/flagLesson/:lessonUID',function(req,res){
	databaseAbstractionController.flagLesson(req.params.lessonUID,function(result){
		res.json(result);
	});
});

//payoutFinancialTransaction=function(UID,amount,tutorExchangeRate,transactionType,transactionUID,callback){ -- checked
//Sample : http://localhost:666/payoutFinancialTransaction/hemant/2/15/payout/transactionUID
router.get('/payoutFinancialTransaction/:UID/:amount/:tutorExchangeRate/:transactionType/:transactionUID',function(req,res){
	databaseAbstractionController.payoutFinancialTransaction(req.params.UID,req.params.amount,req.params.tutorExchangeRate,req.params.transactionType,req.params.transactionUID,function(result){
		res.json(result);
	});
});

//exports.reAddHoursWallet = function(UID,amount,transactionType,transactionUID,callback){
//Sample : http://localhost:666/reAddHoursWallet/2a9ad01048a98cfcf085d97a97c33420/amount/incompleteLesson/transactionUID
router.get('/reAddHoursWallet/:UID/:amount/:transactionType/:transactionUID',function(req,res){
	databaseAbstractionController.reAddHoursWallet(req.params.UID,req.params.amount,req.params.transactionType,req.params.transactionUID,function(result){
		res.json(result);
	});
});


//Top Layer Routes

//buyHours=function(UID,isTutor,amount,callback)
//Sample : http://localhost:666/buyHours/ishan/false/5 //2a9ad01048a98cfcf085d97a97c33420
router.get('/buyHours/:UID/:isTutor/:amount',function(req,res){
	databaseTopController.buyHours(req.params.UID,req.params.isTutor,req.params.amount,function(result){
		res.json(result);
	});
});

//uploadSolutionTop=function(lessonUID,subject,solutionLinks,callback){
//Sample : http://localhost:666/uploadSolutionTop/lessonUID/physics/someThing
router.get('/uploadSolutionTop/:lessonUID/:subject/:solutionLinks',function(req,res){
	databaseTopController.uploadSolutionTop(req.params.lessonUID,req.params.subject,req.params.solutionLinks,function(result){
		res.json(result);
	});
});

//uploadLessonTop=function(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
//Sample : http://localhost:666/uploadLessonTop/ishan/false/physics/'Something'/'nothing'/10/2/false : public lesson
//		   http://localhost:666/uploadLessonTop/ishan/hemant/physics/'Something'/'nothing'/10/2/true : private lesson
router.get('/uploadLessonTop/:studentUID/:tutorUID/:subject/:message/:fileLinks/:deadlineHours/:numberOfHours/:privatePublicKey',function(req,res){
	databaseTopController.uploadLessonTop(req.params.studentUID,req.params.tutorUID,req.params.subject,req.params.message,req.params.fileLinks,req.params.deadlineHours,req.params.numberOfHours,req.params.privatePublicKey,function(result){
		res.json(result);
	});
});

//assignPublicLessonTop=function(lessonUID,tutorUID,subject,callback){
//Sample : http://localhost:666/assignPublicLessonTop/lessonUID/hemant/physics //e66aa4de3237fa7626ab49f61ce4c6dd
router.get('/assignPublicLessonTop/:lessonUID/:tutorUID/:subject',function(req,res){
	databaseTopController.assignPublicLessonTop(req.params.lessonUID,req.params.tutorUID,req.params.subject,function(result){
		res.json(result);
	});
});

//cashOutTutor=function(tutorUID,callback){
//Sample : http://localhost:666/cashOutTutor/hemant
router.get('/cashOutTutor/:tutorUID',function(req,res){
	databaseTopController.cashOutTutor(req.params.tutorUID,function(result){
		res.json(result);
	});
});

//Student controller route testing

//Change Tutor change account type
//Sample : http://localhost:666/changeTutor/tutorUID
router.get('/changeTutor/:tutorUID',function(req,res){
	tutorController.updateTutorDetails(req.params.tutorUID,
		{
			'accountType':1,
			'tutorVerified':true,
			'tutorApproved':true

		},function(result){
			res.json(result);
		});
});

//Change Tutor add subjects
//Sample : http://localhost:666/changeTutorSubject/tutorUID/physics/maths
router.get('/changeTutorSubject/:tutorUID/:subject1/:subject2',function(req,res){
	var subjects = [];
	subjects.push(req.params.subject1);
	subjects.push(req.params.subject2);
	tutorController.updateTutorDetails(req.params.tutorUID,
		{
			'subjects':subjects
		},function(result){
			res.json(result);
		});
});




//Sample : http://localhost:666/changeStudent/studentUID/ishan/123
router.get('/changeStudent/:studentUID/:name/:password',function(req,res){
	studentController.updateStudentDetails(req.params.studentUID,
		{
			'name':req.params.name,
			'password':req.params.password
		},function(result){
			res.json(result);
		});
});



module.exports = router;