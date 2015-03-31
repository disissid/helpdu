var databaseUGUR = require('./databaseUGURController.js');
var databaseAbstraction = require('./databaseAbstractionController.js');
var mongoose = require('mongoose');
var moment = require('moment');
var databaseModels = require('../models/databaseModels.js');

/*
Developer Comments:

tutorExchangeRate = 15;


*/

// Adds physics Lesson if it doesn't exists : temporary

databaseUGUR.getSubjectList(function(subjectListItems){
	var flag = 0;
	for(var i=0; i<subjectListItems.length; i++){
		if(subjectListItems[i].subjectName == 'physics'){
			flag++;
		}
	}
	if(flag === 0){
		newSubject=new subjectList({
			subjectName:'physics'
		});
		newSubject.save(function(err,subject){
			if (err)
				console.log(err);
			else
				console.log(subject);
		});
	}
});


exports.buyHours=function(UID,isTutor,amount,callback){
	var exchangeRate;
	if(amount == 1 || amount == 3 || amount == 5){
		if(amount == 1){
			exchangeRate = 30;
		}
		else if(amount == 3){
			exchangeRate = 25;
		}
		else if(amount == 5){
			exchangeRate = 20;
		}
		databaseAbstraction.addHoursWallet(UID,'false',amount,exchangeRate,'wallet',function(returnedObject){
			if(returnedObject.code == 7){
				callback({'code':'7','message':'Succefully Added Hours'});
			}
			else if(returnedObject.code == 4){
				callback({'code':'4','message':returnedObject.message});
			}
		});
	}
	else{
		callback({'code':'4','message':'Buying amount not found'});
	}
};


exports.uploadSolutionTop=function(lessonUID,subject,solutionLinks,callback){
	databaseAbstraction.uploadSolutionLessonAbstract(lessonUID,subject,solutionLinks,function(err){
		if(err.code==7){
			databaseAbstraction.completedLessonAbstract(lessonUID,subject,function(err){
				if(err.code==7){
					databaseAbstraction.addHoursCompletedLesson(lessonUID,'lesson',function(err){
						if(err.code == 7){
							callback({'code':'7','message':'Succefully uploaded the lesson'});
						}
						else if(err.code == 4){
							callback({'code':'4','message':err.message});
						}
					});
				}
				else if(err.code == 4){
					callback({'code':'4','message':err.message});
				}
			});
		}
		else if(err.code==4)
		{
			callback({'code':'4','message':err.message});
		}
	});
};

exports.uploadLessonTop=function(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
 	if(privatePublicKey == 'true'){
 		databaseAbstraction.uploadLessonAbstract(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,'true',function(returnedObject){
 			if(returnedObject.code == 7){
 				var lessonUID = returnedObject.lessonUID;
 				databaseAbstraction.assignTutor(lessonUID,tutorUID,subject,function(returnedObject){
 					if(returnedObject.code == 7){
 						databaseAbstraction.removeHoursWallet(studentUID,'false',numberOfHours,'lesson',lessonUID,'false',function(){
 							if(returnedObject.code == 7){
 								callback({'code':'7','message':'Succefully Uploaded the lesson'});
 							}
 							else if(returnedObject.code == 4){
 								callback({'code':'4','message':returnedObject.message});
 							}
 						});
 					}
 					else if(returnedObject.code == 4){
 						callback({'code':'4','message':returnedObject.message});
 					}
 				});
 			}
 			else{
 				callback({'code':returnedObject.code,'message':returnedObject.message});
 			}
 		});
 	}
 	else if(privatePublicKey == 'false'){
 		databaseAbstraction.uploadLessonAbstract(studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,'false',function(returnedObject){
 			if(returnedObject.code == 7){
 				var lessonUID = returnedObject.lessonUID;
 				databaseAbstraction.removeHoursWallet(studentUID,'false',numberOfHours,'lesson',lessonUID,'false',function(){
 					if(returnedObject.code == 7){
 						callback({'code':'7','message':'Succefully upload the Lesson'});
 					}
 					else if(returnedObject.code == 4){
 						callback({'code':'4','message':returnedObject.message});
 					}
 				});
 			}
 			else{
 				callback({'code':returnedObject.code,'message':returnedObject.message});
 			}
 		}); 		
 	}
};


exports.assignPublicLessonTop=function(lessonUID,tutorUID,subject,callback){
	databaseAbstraction.assignTutor(lessonUID,tutorUID,subject,function(returnedObject){
		if(returnedObject.code == 7){
			callback({'code':'7','message':'Succefully Assigned the lesson'});
		}
		else if(returnedObject.code == 4){
			callback({'code':'4','message':returnedObject.message});
		}
	});
};

//Only payment gateway needs to be addressed now
exports.cashOutTutor=function(tutorUID,callback){
	var tutorExchangeRate = 15;
	databaseUGUR.getCurrentUIDWallet({'UID':tutorUID},function(returnedObject){
		if(returnedObject.code == 4){
			callback({'code':'4','message':returnedObject.message});
		}
		else if(returnedObject[0].currentBalance !== 0){
			var currentBalance = returnedObject[0].currentBalance;
			var transactionUID = mongoose.Types.ObjectId();
			databaseAbstraction.payoutFinancialTransaction(tutorUID,currentBalance,tutorExchangeRate,'payout',transactionUID,function(returnedObject){
				if(returnedObject.code == 7){
				//function(UID,isTutor,amount,transactionType,lessonUID,callback){
					databaseAbstraction.removeHoursWallet(tutorUID,'true',currentBalance,'payout','false',transactionUID,function(returnedObject){
						if(returnedObject.code == 7){
							callback({'code':'7','message':'Succefully Paid the amount'});
						}
						else{
							callback({'code':returnedObject.code,'message':returnedObject.message});
						}
					});
				}
				else{
					callback({'code':returnedObject.code,'message':returnedObject.message});
				}
			});	
		}
	});
};


var lastCleanDate;
var extensionMultiplier = 1.5;
/*
Extension Multiplier current value is 1.5
This means a lesson whose number of hours = 1 will get unassigned in 1.5 hours
*/

function removeObsoleteLessons(subject){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getSubjectTimeTracker'});
		}
		else{
			var tempModel = mongoose.model(subject+'TimeTracker',databaseModels.subjectTimeTrackerSchema,subject+'TimeTracker');
			var currentDate = moment();
			lastCleanDate = moment();
			var stream = tempModel.find().stream();
			stream.on('data', function (doc) {
				var deadlineDate = moment(doc.createdTimestamp);
				var deadlineHours = doc.deadlineHours;
				var lessonUID = doc.lessonUID;
				var studentUID = doc.studentUID;
				deadlineDate.add(deadlineHours,'hours');
				//deadlineDate.add(15,'seconds');
				if(deadlineDate <= currentDate){ //Lesson has expired
					//exports.removeLessonAbstract=function(lessonUID,subject,callback){
					databaseAbstraction.removeLessonAbstract(lessonUID,subject,function(returnedObject){
						//exports.reAddHoursWallet = function(UID,amount,transactionType,transactionUID,callback){
						databaseAbstraction.reAddHoursWallet(studentUID,returnedObject.numberOfHours,'incompleteLesson','false',function(err){
							console.log('removed Lesson');
						});
					});
				}
				else{
					var privatePublicKey = doc.privatePublicKey;
					var locked = doc.locked;

					if(privatePublicKey == false && locked == 1){
						var timeoutDate = moment(doc.lockTime);
						var timeoutTime = extensionMultiplier * doc.numberOfHours;
						timeoutDate.add(timeoutTime,'hours');
						if(timeoutDate <= currentDate){ //Lesson should be unassigned now
							//exports.unassignTutorAbstract=function(lessonUID,subject,callback){
							databaseAbstraction.unassignTutorAbstract(lessonUID,subject,function(returnedObject){
								//do nothing
							});
						}
					}
				}
			}).on('error', function (err) {
				console.log('Error in cleaning Database'); //Put this in the logger application
			}).on('close', function () {
				//console.log('Done cleaning Database');
			});
		}
	});	
}



function cleanUpDatabase(){
	//This code runs every 10 minutes.
	databaseUGUR.getSubjectList(function(subjectList){
		var success = 1;
		for(var i=0; i<subjectList.length; i++){
			removeObsoleteLessons(subjectList[i].subjectName);
		}
	});
}

var cleanUp = setInterval(cleanUpDatabase,1000);




function errorHandling(successArray,params,callback){
	var firstError = 0;
	//This means that the last inserted element had error
	if(successArray[successArray.length-1].code===0){
		for(var i=0; i<successArray.length-1; i++){
			if(typeof successArray[i].callOnError == 'function')
				successArray[i].callOnError();
			else firstError = 1;
		}
		if(firstError===0)
			callback ({'code':4});
		else if(firstError===1)
			callback({'code':12});
	}
	else if(successArray.length==params){
		 callback({'code':7});
	}	
}

