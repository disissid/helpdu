var databaseModels = require('../models/databaseModels.js');
var userModels = require('../models/userModels.js');
var mongoose = require('mongoose');
var moment = require('moment');

/*
Things to be done:
	1. combine uploadStudentLesson and uploadTutorLesson in abstraction layer.
*/
/*

These are the basic allowed CRUD operations(More like UGUR:Upload, Get, Update, Remove) with 
error handling and all types of the tables/Collections we have. Only particular fields can be
updated currently in the update operation when further support will be required then additional
operations will be entered.

These UGUR operations will be then used to build specific methods, such as lesson insertion.

Basic dependency listing,

(*)Subject Lesson
	->CompletedLesson
	->timeTracker
*/

//Get the subject list
exports.getSubjectList=function(callback){
	subjectList.find({},function(err,subject){
		if(err){
			//Error Handling
		}
		else{
			callback(subject);
		}
	});
};	


/*-----------------------------Completed Lesson Functions-----------------------------*/

/*
Every Method here is preceded by the its function and the additional improvements that need to be
done in future.
*/

/*

->Create a overloading function if required.

exports.uploadCompletedLesson=function(arg1,arg2,arg3,arg4,agr5){
	if(arguments.length == 3){
		uploadCompletedLessonImplementation1(arg1,arg2,arg3);
	}
	else if(arguments.length == 5){
		uploadCompletedLessonImplementation2(arg1,arg2,arg3,arg4,agr5);
	}
}

IMPORTANT use of this function requires the lesson to be present in the subjectLesson collection.

*/


exports.uploadCompletedLesson=function(lessonUID,subject,callback){
	
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadCompletedLesson'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/uploadCompletedLesson'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			tempModel.findOne({ lessonUID:lessonUID},function(err,returnedLesson){
				if(err)
					callback({'code':'4','message':err,'function':'UGURController/uploadCompletedLesson'});
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson does not exist','function':'UGURController/uploadCompletedLesson'});
				}
				else if(returnedLesson){
					returnedLesson.completedTimestamp=moment();
					var tempCompletedLesson = new completedLessonModel(returnedLesson);
					tempCompletedLesson.save(function(err,returnedCompletedLesson){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/uploadCompletedLesson'});
						}
						else{
							callback({'code':'7','message':'Succefully Stored Lesson'});
						}
					});
				}
			});				
		}
	});
};

//Update a completed lesson with feedback system
exports.updateCompletedLesson=function(lessonUID,tutorRating,tutorReview,flaggedLesson,callback){
	completedLessonModel.findOne({ lessonUID:lessonUID },function(err,returnedCompletedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateCompletedLesson'});
		}
		else if(!returnedCompletedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/updateCompletedLesson'});
		}
		else if(returnedCompletedLesson){
			if (tutorRating!=='null')
				returnedCompletedLesson.tutorRating=tutorRating;
			if (tutorReview!=='false')
				returnedCompletedLesson.tutorReview=tutorReview;
			if (flaggedLesson!=='null')
				returnedCompletedLesson.flaggedLesson=flaggedLesson;
			returnedCompletedLesson.save(function(err,lesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateCompletedLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Updated Lesson'});
				}
			});				
		}
	});	
};

//Remove a lesson from the completed Database
/*
This function should only be used for removing a single lesson, it shouldn't be called multiple times to remove
a large number of completedLessons. Make a function to remove lot of lessons.
*/
exports.removeCompletedLesson=function(lessonUID,callback){
	completedLessonModel.findOne({ lessonUID:lessonUID },function(err,returnedCompletedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeCompletedLesson'});
		}
		else if(!returnedCompletedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/removeCompletedLesson'});
		}
		else if(returnedCompletedLesson){
			returnedCompletedLesson.remove(function(err){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeCompletedLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Removed Lesson'});
				}
			});
		}
	});
};

exports.getCompletedLesson=function(searchObject,callback){
	completedLessonModel.find(searchObject,function(err,completedLessons){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getCompletedLesson'});
		}
		else{
			callback({'code':'1','message':completedLessons});
		}
		
	});
};

/*-----------------------------Completed Lesson Functions-----------------------------*/


/*-----------------------------Student Lesson Functions-----------------------------*/

/*
IMPORTANT before calling this function from alpha server make sure that the user is logged in
and the sent studentUID/tutorUID is valid, not doing so will create a false collection for that
query.

The following function writes the lesson to the studentUIDLesson collection.
*/
// I think studentUID is useless here in the model
exports.uploadStudentLesson=function(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	var newStudentUIDLesson = new tempModel({
		lessonUID:lessonUID,
		studentUID:studentUID,
		subject:subject,
		message:message,
		fileLinks:fileLinks,
		deadlineHours:deadlineHours,
		numberOfHours:numberOfHours,
		privatePublicKey:privatePublicKey,
		completed:false
	});
	//Only put tutor UID if it is supplied, if false is supplied than don't fill
	//Private Lesson Tutor UID will be supplied but in case of Public Lesson no tutorUID will be supplied 
	if(tutorUID!=='none')
		newStudentUIDLesson.tutorUID=tutorUID;
	else
		newStudentUIDLesson.tutorUID='';
	newStudentUIDLesson.save(function(err,lesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadStudentLesson'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Lesson'});
		}
	});
};

//Updates the student Lesson
/*
This function takes a lessonUID, and changes the parameters given in the attributes, if present,
if the attributes are not to be set then false should be given for these values any other value
will store that value in the database
*/

exports.updateStudentLesson=function(studentUID,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback){
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	//console.log(lessonUID);
	tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateStudentLesson'});
		}
		else if(!returnedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/updateStudentLesson'});
		}
		else if(returnedLesson){
			if (tutorUID!=='false')
				returnedLesson.tutorUID=tutorUID;
			if (locked!=='false')
				returnedLesson.locked=locked;
			if (lockTime!=='false')
				returnedLesson.lockTime=lockTime;
			if (unlockTime!=='false')
				returnedLesson.unlockTime=unlockTime;
			if (solutionLinks!=='false')
				returnedLesson.solutionLinks=solutionLinks;
			if (completed !== 'null')
				returnedLesson.completed=completed;
			returnedLesson.save(function(err,lesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateStudentLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Updated Lesson'});
				}
			});					
		}
	});	
};



//The following function removes the lesson from the studentUIDLesson collection.
exports.removeStudentLesson=function(studentUID,lessonUID,callback){
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeStudentLesson'});
		}
		else if(!returnedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/removeStudentLesson'});
		}
		else if(returnedLesson){
			returnedLesson.remove(function(err){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeStudentLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Removed Lesson'});
				}
			});
		}
	});
};

exports.getStudentLesson=function(studentUID,searchObject,callback){
	var tempModel = mongoose.model('Lesson'+studentUID,databaseModels.lessonSchema,'Lesson'+studentUID);
	tempModel.find(searchObject,function(err,studentLessonList){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getStudentLesson'});
		}
		else{
			callback({'code':'1','message':studentLessonList});
		}
	});
};


/*-----------------------------Student Lesson Functions-----------------------------*/



/*-----------------------------Tutor Lesson Functions-----------------------------*/

/*
IMPORTANT before calling this function from alpha server make sure that the user is logged in
and the sent studentUID/tutorUID is valid, not doing so will create a false collection for that
query.

The following function writes the lesson to the tutorUIDLesson collection.
*/
exports.uploadTutorLesson=function(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
	var tempModel = mongoose.model('Lesson'+tutorUID,databaseModels.lessonSchema,'Lesson'+tutorUID);
	var newTutorUIDLesson = new tempModel({
		lessonUID:lessonUID,
		studentUID:studentUID,
		tutorUID:tutorUID,
		subject:subject,
		message:message,
		fileLinks:fileLinks,
		deadlineHours:deadlineHours,
		numberOfHours:numberOfHours,
		privatePublicKey:privatePublicKey,
		completed:false
	}); 
	newTutorUIDLesson.save(function(err,lesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadTutorLesson'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Lesson'});
		}
	});	
};

//Update the lesson in Tutor
exports.updateTutorLesson=function(lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback){
/*console.log(lessonUID);
console.log(tutorUID);
console.log(locked);
console.log(lockTime);
console.log(unlockTime);
console.log(solutionLinks);
*/
	var tempModel = mongoose.model('Lesson'+tutorUID,databaseModels.lessonSchema,'Lesson'+tutorUID);
	tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateTutorLesson'});
		}
		else if(!returnedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/updateTutorLesson'});
		}
		else if(returnedLesson){
			if (locked!=='false')
				returnedLesson.locked=locked;
			if (lockTime!=='false')
				returnedLesson.lockTime=lockTime;
			if (unlockTime!=='false')
				returnedLesson.unlockTime=unlockTime;
			if (solutionLinks!=='false')
				returnedLesson.solutionLinks=solutionLinks;
			if (completed!=='null')
				returnedLesson.completed=completed;
			returnedLesson.save(function(err,lesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateTutorLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Updated Lesson'});
				}
			});					
		}
	});	
};


//The following function removes the lesson from the studentUIDLesson collection.
exports.removeTutorLesson=function(tutorUID,lessonUID,callback){
	var tempModel = mongoose.model('Lesson'+tutorUID,databaseModels.lessonSchema,'Lesson'+tutorUID);
	tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeTutorLesson'});
		}
		else if(!returnedLesson){
			callback({'code':'4','message':'Lesson not found','function':'UGURController/removeTutorLesson'});
		}
		else if(returnedLesson){
			returnedLesson.remove(function(err){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeTutorLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Removed Lesson'});
				}
			});
		}
	});
};

exports.getTutorLesson=function(tutorUID,searchObject,callback){
	var tempModel = mongoose.model('Lesson'+tutorUID,databaseModels.lessonSchema,'Lesson'+tutorUID);
	tempModel.find(searchObject,function(err,tutorLessonList){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getTutorLesson'});
		}
		else{
			callback({'code':'1','message':tutorLessonList});
		}
	});
};




/*-----------------------------Tutor Lesson Functions-----------------------------*/



/*-----------------------------Subject Lesson Functions-----------------------------*/

//Upload a lesson to global subjectLesson Db
exports.uploadSubjectLesson=function(lessonUID,studentUID,tutorUID,subject,message,fileLinks,deadlineHours,numberOfHours,privatePublicKey,callback){
	var generateDate = moment();
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadSubjectLesson'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/uploadSubjectLesson'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			var newSubjectLesson = new tempModel({
				lessonUID:lessonUID,
				studentUID:studentUID,
				subject:subject,
				message:message,
				fileLinks:fileLinks,
				initialTimestamp:generateDate,
				deadlineHours:deadlineHours,
				numberOfHours:numberOfHours,
				privatePublicKey:privatePublicKey,
				completed:false
			}); 
			//Only put tutor UID if it is supplied, if false is supplied than don't fill 
			if(tutorUID)
				newSubjectLesson.tutorUID=tutorUID;

			newSubjectLesson.save(function(err,lesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/uploadSubjectLesson'});
				}
				else{
					callback({'code':'7','message':'Succefully Stored Lesson'});
				}
			});
		}
	});
};

//Update a lesson to global subjectLesson Db
/*
This is for updating the main database when a new tutor takes a lesson. This might be a bad approach
due to write lock on the whole database when this time consuming process happens. A better approach
might be to create another database and then store only this information in that database and remove
these fields from this database. But this will also mean shifting to a more relational paradigm.
To be taken in account in the 5th iteration.
*/

/*
This function takes a lessonUID, and changes the parameters given in the attributes, if present,
if the attributes are not to be set then false should be given for these values any other value
will store that value in the database
*/

exports.updateSubjectLesson=function(subject,lessonUID,tutorUID,locked,lockTime,unlockTime,solutionLinks,completed,callback){

	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateSubjectLesson'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/updateSubjectLesson'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateSubjectLesson'});
				}
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson not found','function':'UGURController/updateSubjectLesson'});
				}
				else if(returnedLesson){
					if (tutorUID!== 'false')
						returnedLesson.tutorUID=tutorUID;
					if (locked!=='false')
						returnedLesson.locked=locked;
					if (lockTime!=='false')
						returnedLesson.lockTime=lockTime;
					if (unlockTime!=='false')
						returnedLesson.unlockTime=unlockTime;
					if (solutionLinks!=='false')
						returnedLesson.solutionLinks=solutionLinks;
					if (completed !== 'null')
						returnedLesson.completed=completed;
					returnedLesson.save(function(err){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/updateSubjectLesson'});
						}
						else{
							callback({'code':'7','message':'Succefully Updated Lesson'});
						}
					});					
				}
			});			
		}
	});
};


//Remove a lesson from global subjectLesson Db
exports.removeSubjectLesson=function(lessonUID,subject,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeSubjectLesson'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/removeSubjectLesson'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeSubjectLesson'});
				}
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson not found','function':'UGURController/removeSubjectLesson'});
				}
				else if(returnedLesson){
					returnedLesson.remove(function(err){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/removeSubjectLesson'});
						}
						else{
							callback({'code':'7','message':'Succefully Removed Lesson'});
						}
					});
				}
			});
		}
	});
};


exports.getSubjectLesson=function(subject,searchObject,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getSubjectLesson'});
		}
		else{
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			tempModel.find(searchObject,function(err,subjectLessonList){	
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/getSubjectLesson'});
				}
				else{
					callback({'code':'1','message':subjectLessonList});
				}
				
			});
		}
	});	
};


/*-----------------------------Subject Lesson Functions-----------------------------*/



/*-----------------------------Subject Timetracker Functions-----------------------------*/


/*
timeTracker Methods
//Depency on the subject lesson database
The timetracker schema would only have initial time creation field, deadline hours.
Its job would be to serve a table which will be polled every 5 miuntes(currently will
be changed to smaller value when resources are available) to automatically remove
incomplete private requests when deadline ends, unlock incomplete public requests when
k*tutorHours ends, remove public requests when deadline ends.
//Currently k is 1.5
*/

//Upload a lesson to global subjectTimeTracker DB
/*
Uploads only when a private lesson to a preassigned tutor or a tutor accepts a public lesson.
needs the lessonUID, and subject and copies from the subjectLesson Database.
*/
exports.uploadSubjectTimeTracker=function(subject,lessonUID,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadSubjectTimeTracker'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/uploadSubjectTimeTracker'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'Lesson',databaseModels.lessonSchema,subject+'Lesson');
			tempModel.findOne({ lessonUID:lessonUID},'lessonUID  studentUID tutorUID initialTimestamp deadlineHours numberOfHours locked lockTime unlockTime privatePublicKey',function(err,returnedLesson){
				if(err)
					callback({'code':'4','message':err,'function':'UGURController/uploadSubjectTimeTracker'});
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson does not exist','function':'UGURController/uploadSubjectTimeTracker'});
				}
				else if(returnedLesson){
					tempModel = mongoose.model(subject+'TimeTracker',databaseModels.subjectTimeTrackerSchema,subject+'TimeTracker');
					var tempSubjectTimeTracker = new tempModel(returnedLesson);
					tempSubjectTimeTracker.save(function(err,returnedCompletedLesson){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/uploadSubjectTimeTracker'});
						}
						else{
							callback({'code':'7','message':'Succefully Stored Lesson'});
						}
					});
				}
			});				
		}
	});
};

//update a lesson in the subjectTimeTracker
exports.updateSubjectTimeTracker=function(lessonUID,subject,tutorUID,locked,lockTime,unlockTime,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateSubjectTimeTracker'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/updateSubjectTimeTracker'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'TimeTracker',databaseModels.subjectTimeTrackerSchema,subject+'TimeTracker');
			tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateSubjectTimeTracker'});
				}
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson not found','function':'UGURController/updateSubjectTimeTracker'});
				}
				else if(returnedLesson){
					if (tutorUID!=='false')
						returnedLesson.tutorUID=tutorUID;
					if (locked!=='false')
						returnedLesson.locked=locked;
					if (lockTime!=='false')
						returnedLesson.lockTime=lockTime;
					if (unlockTime!=='false')
						returnedLesson.unlockTime=unlockTime;
					returnedLesson.save(function(err,lesson){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/updateSubjectTimeTracker'});
						}
						else{
							callback({'code':'7','message':'Succefully Updated Lesson'});
						}
					});					
				}
			});			
		}
	});
};

//Remove a lesson from the subjectTimeTracker
exports.removeSubjectTimeTracker=function(lessonUID,subject,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeSubjectTimeTracker'});
		}
		else if(!returnedSubject){
			callback({'code':'4','message':'Subject Does not exist','function':'UGURController/removeSubjectTimeTracker'});
		}
		else if(returnedSubject){
			var tempModel = mongoose.model(subject+'TimeTracker',databaseModels.subjectTimeTrackerSchema,subject+'TimeTracker');
			tempModel.findOne({ lessonUID:lessonUID },function(err,returnedLesson){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeSubjectTimeTracker'});
				}
				else if(!returnedLesson){
					callback({'code':'4','message':'Lesson not found','function':'UGURController/removeSubjectTimeTracker'});
				}
				else if(returnedLesson){
					returnedLesson.remove(function(err){
						if(err){
							callback({'code':'4','message':err,'function':'UGURController/removeSubjectTimeTracker'});
						}
						else{
							callback({'code':'7','message':'Succefully Removed Lesson'});
						}
					});
				}
			});
		}
	});
};

//Gets all the lessons from the subjectTimeTracker 
exports.getSubjectTimeTracker=function(subject,searchObject,callback){
	subjectList.findOne({subjectName:subject},function(err,returnedSubject){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getSubjectTimeTracker'});
		}
		else{
			var tempModel = mongoose.model(subject+'TimeTracker',databaseModels.subjectTimeTrackerSchema,subject+'TimeTracker');
			tempModel.find(searchObject,function(err,subjectLessonList){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/getSubjectTimeTracker'});
				}
				else{
					callback({'code':'1','message':subjectLesssonList});
				}
				
			});
		}
	});	
};

/*-----------------------------Subject Timetracker Functions-----------------------------*/





/*-----------------------------Finance Journal Functions-----------------------------*/




exports.uploadFinanceJournal=function(transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,isReversed,callback){
	var generateDate = moment();
	var newFinanceRecord = new financeJournalModel({
		transactionUID:transactionUID,
		transactionType:transactionType, 
		transactionComment:transactionComment, 
		initialTimestamp:generateDate,
		debitAccount:debitAccount,
		creditAccount:creditAccount,
		amount:amount,
		isReversed:isReversed,
		blocked:blocked
	});
	
	if(lessonUID != 'false' && transactionType=='lesson'){
		newFinanceRecord.lessonUID=lessonUID;
	}

	newFinanceRecord.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadFinanceJournal'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Finance Record'});
		}
	});

};



exports.removeFinanceJournal=function(transactionUID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.getFinanceJournal=function(searchObject,callback){
	financeJournalModel.find(searchObject,function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getFinanceJournal'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};

/*-----------------------------Finance Journal Functions-----------------------------*/

/*-----------------------------Payment Transactions Functions-----------------------------*/



exports.doPaymentTransaction=function(transactionUID,transactionType,debitAccount,creditAccount,amount,callback){
	callback({'code':'7','message':'success'});
};

exports.cancelPaymentTransaction=function(transactionUID,transactionType,debitAccount,creditAccount,amount,callback){

};


/*-----------------------------Payment Transactions Functions-----------------------------*/

/*-----------------------------Wallet Journal Functions-----------------------------*/


exports.uploadWalletJournal=function(transactionUID,transactionType,lessonUID,transactionComment,debitAccount,creditAccount,amount,blocked,callback){
	var generateDate = moment();
	var newWalletRecord = new walletJournalModel({
		transactionUID:transactionUID,
		transactionComment:transactionComment,
		transactionType:transactionType,
		initialTimestamp:generateDate,
		debitAccount:debitAccount,
		creditAccount:creditAccount,
		amount:amount,
		blocked:blocked
	});
	
	if(lessonUID !='false'  && transactionType=='lesson'){
		newWalletRecord.lessonUID=lessonUID;
	}

	newWalletRecord.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadWalletJournal'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Wallet Record'});
		}
	});
};

exports.updateWalletJournal=function(transactionUID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.removeWalletJournal=function(transactionUID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.getWalletJournal=function(searchObject,callback){
	walletJournalModel.find(searchObject,function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getWalletJournal'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};

/*-----------------------------Wallet Journal Functions-----------------------------*/



/*-----------------------------Specific Finantial Functions-----------------------------*/
/*
The UID supplied should be correct otherwise fake accounts will get created
*/
exports.uploadSpecificFinanceLedger=function(transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback){
	var generateDate = moment();
	var tempModel = mongoose.model('FinanceLedger'+UID,databaseModels.specificLedgerSchema,'FinanceLedger'+UID);
	var newSpecificFinanceRecord = new tempModel({
		transactionUID:transactionUID,
		transactionType:transactionType, 
		transactionComment:transactionComment, 
		initialTimestamp:generateDate,
		transactionAccount:transactionAccount,
		debitAmount:debitAmount,
		creditAmount:creditAmount,
		blocked:blocked
	});
	
	if(lessonUID != 'false' && transactionType=='lesson'){
		newSpecificFinanceRecord.lessonUID=lessonUID;
	}

	newSpecificFinanceRecord.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadSpecificFinanceLedger'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Finance Record'});
		}
	});

};

exports.updateSpecificFinanceJournal=function(transactionUID,UID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.removeSpecificFinanceJournal=function(transactionUID,UID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.getSpecificFinanceLedger=function(UID,searchObject,callback){
	var tempModel = mongoose.model('FinanceLedger'+UID,databaseModels.specificLedgerSchema,'FinanceLedger'+UID);
	tempModel.find(searchObject,function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getSpecificFinanceLedger'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};


/*-----------------------------Specific Finantial Functions-----------------------------*/




/*-----------------------------Specific Wallet Functions-----------------------------*/
/*

The UID supplied should be correct otherwirse false accounts will get created
*/
exports.uploadSpecificWalletLedger=function(transactionUID,transactionType,UID,lessonUID,transactionComment,transactionAccount,debitAmount,creditAmount,blocked,callback){
/*
console.log(transactionUID);
console.log(transactionType);
console.log(UID);
console.log(lessonUID);
console.log(transactionComment);
console.log(transactionAccount);
console.log(debitAmount);
console.log(creditAmount);
console.log(blocked);
*/
	var tempModel = mongoose.model('WalletLedger'+UID,databaseModels.specificLedgerSchema,'WalletLedger'+UID);
	var generateDate = moment();
	var newSpecificWalletRecord = new tempModel({
		transactionUID:transactionUID,
		transactionType:transactionType, 
		transactionComment:transactionComment, 
		initialTimestamp:generateDate,
		transactionAccount:transactionAccount,
		debitAmount:debitAmount,
		creditAmount:creditAmount,
		blocked:blocked
	});

	if(lessonUID != 'false' && transactionType =='lesson'){
		newSpecificWalletRecord.lessonUID=lessonUID;
	}

	newSpecificWalletRecord.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadSpecificWalletLedger'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Finance Record'});
		}
	});
};

exports.updateSpecificWalletLedger=function(transactionUID,UID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.removeSpecificWalletLedger=function(transactionUID,UID,callback){
/*
	There is no update functionality currently, if a transaction is to be reversed a reverse entry is
	would be made in the log. Update functionality will be added into the 
*/
};

exports.getSpecificWalletLedger=function(UID,searchObject,callback){
	var tempModel = mongoose.model('WalletLedger'+UID,databaseModels.specificLedgerSchema,'WalletLedger'+UID);
	tempModel.find(searchObject,function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getSpecificWalletJournal'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};

/*-----------------------------Specific Wallet Functions-----------------------------*/



/*-----------------------------Current Wallet Functions-----------------------------*/


/*
IMPORTANT before calling this function from alpha server make sure that the user is logged in
and the sent studentUID/tutorUID is valid, not doing so will create a false collection for that
query.

*/
//Initializes the Current UID Wallet
exports.uploadCurrentUIDWallet=function(UID,isTutor,callback){
	var newCurrentUIDWallet = new currentUIDWalletModel({
		UID:UID,
		isTutor:isTutor,
		currentBalance:0
	});

	newCurrentUIDWallet.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadCurrentUIDWallet'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored in currentUIDWallet'});
		}
	});
};

//Add hours in the current UID Wallet
exports.updateCurrentUIDWallet=function(UID,isTutor,addBalance,callback){
	currentUIDWalletModel.findOne({ UID:UID },function(err,returnedWallet){
	var newWallet;
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/updateCurrentUIDWallet'});
		}
		else if(!returnedWallet){
			newWallet = new currentUIDWalletModel({
				UID:UID,
				isTutor:isTutor,
				currentBalance:addBalance,
			}); 
			newWallet.save(function(err,wallet){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateCurrentUIDWallet'});
				}
				else{
					callback({'code':'7','message':'Succefully Initialized Wallet'});
				}
			});		
		}
		else if(returnedWallet){
			returnedWallet.currentBalance+=addBalance;
			returnedWallet.save(function(err,wallet){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/updateCurrentUIDWallet'});
				}
				else{
					callback({'code':'7','message':'Succefully Updated Wallet'});
				}
			});					
		}
	});	
};


exports.removeCurrentUIDWallet = function(){
	/*
		There is no remove function in the current Wallet.
	*/
};

exports.getCurrentUIDWallet = function(searchObject,callback){
	currentUIDWalletModel.find(searchObject,function(err,returnedWallets){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/getCurrentUIDWallet'});
		}
		else if (returnedWallets.length === 0){
			callback([{currentBalance:0}]);
		}
		else{
			callback(returnedWallets);
		}
	});
};

/*-----------------------------Notification Functions-----------------------------*/
//Private lesson -> tutor -> 0
//Tutor Solution -> student ->1
//lesson delete -> student ->2 / tutor depending if it was locked or not ->3
//lesson unassign -> tutor ->4
//Message -> Both student and tutor ->5

exports.uploadNotification=function(UID,notificationUID,notificationType,notificationFromUID,notificationFromName,callback){
	var tempModel = mongoose.model('Notifications'+UID,databaseModels.notificationSchema,'Notifications'+UID);
	var newNotification = new tempModel({
		notificationType:notificationType,
		notificationUID:notificationUID,
		notificationFromUID:notificationFromUID,
		notificationFromName:notificationFromName,
		notificationRead:false
	});
	
	newNotification.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadNotification'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Notification'});
		}
	});
};

//getNotification
exports.getNotification=function(UID,callback){
	var tempModel = mongoose.model('Notifications'+UID,databaseModels.notificationSchema,'Notifications'+UID);
	tempModel.find(function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getNotification'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};

//removeNotification
exports.removeNotification=function(UID,notificationUID,callback){
var tempModel = mongoose.model('Notifications'+UID,databaseModels.notificationSchema,'Notifications'+UID);
	tempModel.findOne({notificationUID:notificationUID},function(err,returnedNotification){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeNotification'});
		}
		else if(!returnedNotification){
			callback({'code':'4','message':'Notification not found','function':'UGURController/removeNotification'});
		}
		else if(returnedNotification){
			returnedNotification.remove(function(err){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeNotification'});
				}
				else{
					callback({'code':'7','message':'Succefully Removed Notification'});
				}
			});
		}
	});
};

/*-----------------------------Notification Functions-----------------------------*/


/*-----------------------------Message Functions-----------------------------*/

exports.uploadMessage=function(UID,messageUID,messageFromUID,message,messageFromName,callback){
	var tempModel = mongoose.model('Message'+UID,databaseModels.messageSchema,'Message'+UID);
	var newMessage = new tempModel({
		messageFromUID:messageFromUID,
		messageUID:messageUID,
		messageFromName:messageFromName,
		message:message,
		messageRead:false
	});
	
	newMessage.save(function(err,record){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/uploadMessage'});
		}
		else{
			callback({'code':'7','message':'Succefully Stored Message'});
		}
	});
};

//getMessage
exports.getMessage=function(UID,callback){
	var tempModel = mongoose.model('Message'+UID,databaseModels.messageSchema,'Message'+UID);
	tempModel.find(function(err,record){
			if(err){
				callback({'code':'4','message':err,'function':'UGURController/getNotification'});
			}
			else{
				callback({'code':'1','message':record});
			}
	});
};

//removeMessage

exports.removeMessage=function(UID,messageUID,callback){
var tempModel = mongoose.model('Message'+UID,databaseModels.messageSchema,'Message'+UID);
	tempModel.findOne({messageUID:messageUID},function(err,returnedMessage){
		if(err){
			callback({'code':'4','message':err,'function':'UGURController/removeMessage'});
		}
		else if(!returnedMessage){
			callback({'code':'4','message':'Notification not found','function':'UGURController/removeMessage'});
		}
		else if(returnedMessage){
			returnedMessage.remove(function(err){
				if(err){
					callback({'code':'4','message':err,'function':'UGURController/removeMessage'});
				}
				else{
					callback({'code':'7','message':'Succefully Removed Message'});
				}
			});
		}
	});
};

/*-----------------------------Message Functions-----------------------------*/

