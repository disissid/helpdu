var mongoose=require('mongoose');
var db = mongoose.connection;
var moment = require('moment');

//Schemas

/*
Developer Comments
Add comments 
*/



//Lesson Schema
var lessonSchema=new mongoose.Schema({
	lessonUID:String, 
	studentUID:String, //student who posts lesson
	tutorUID:String, //currently assigned tutor to the lesson
	tutorRating:Boolean, //Final rating the tutor got for this lesson
	tutorReview:String, //Final Review the tutor got for this lesson
	flaggedLesson:{type:Boolean,default:false}, 
	/*
	If a lesson is flagged by the student for a non-satisfactory answer 
	it would be sent to to the admin panel who have either the option to
	dismiss and set flag to false, otherwise would have a function to 
	initiate refund of student and de-credition of tutor.
	*/
	subject:String,
	message:String, //Message Associated with the lesson
	fileLinks:String, //File uploaded by the student
	initialTimestamp:{type:Date},//Time of initial creation of lesson by student(only present in the subjectLessonDb)
	completedTimestamp:{type:Date}, //Time of final completion of lesson by tutor
	deadlineHours:{type:Number,min:0},
	/*
	Deadline hours + created timestamp of subject lesson will give deadline time.
	*/
	numberOfHours:{type:Number,min:0},
	createdTimestamp:{type:Date},
	/*
	The created timestamp stores the timestamp when the entry is entered
	in the database. So a lesson entry of completedLesson will show when
	the lesson was completed, and a lesson entry of subjectLesson willl show
	when the lesson was initially created.
	*/
	updatedTimestamp:{type:Date}, //Stores the most recent time when a lesson is updated in any database 
	//Will not be updated on the main database 
	locked:{type:Number, default:0}, //lesson is locked and cannot be assigned to any tutor
	lockTime:{type:Date}, //When the current tutor took the lesson
	unlockTime:{type:Date}, //When the most recent last tutor left the lesson
	solutionLinks:{type:String}, //Link to the uploaded solution by the tutor
	privatePublicKey:Boolean, //If the lesson is public or private
	completed:Boolean
});

//When a lesson is stored in any database first the created timestamp is stored and then whenever the document is update the updated timestamp works.
//Have to see if the updated timestamp code works with model.update method.
lessonSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

lessonSchema.index({lessonUID:-1}); //Check the order of sort here +1 or -1 for desc time

//Subject List Schema
var subjectListSchema=new mongoose.Schema({
	subjectName:String
});


/*
Developer Comments
* Notification Type need to be classified
* Notification image url need to be added
*/


/*
Notification Schema

Various Different Notification types are to be used.
Notification Types:
0,1,2,3,4,5,6,7,8,9,10,11
//Private lesson -> tutor -> 0
//Tutor Solution -> student ->1
//lesson delete -> student ->2 / tutor depending if it was locked or not ->3
//lesson unassign -> tutor ->4
//Message -> Both student and tutor ->5
*/

var notificationSchema=new mongoose.Schema({
	notificationType:Number,
	notificationUID:String,
	notificationFromUID:String,
	notificationFromName:String,
	notificationRead:Boolean,
	createdTimestamp:{type:Date},
});

notificationSchema.pre('save', function(next){
  now = moment();
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});




/*
Message Schema
*/

var messageSchema=new mongoose.Schema({
	messageFromUID:String,
	messageUID:String,
	messageFromName:String,
	createdTimestamp:{type:Date},
	message:String,
	messageRead:Boolean
});

/*
When a message is stored in any database first the created timestamp is stored and then whenever the document is update the updated timestamp works.
*/
messageSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

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

var subjectTimeTrackerSchema = new mongoose.Schema({
	lessonUID:String, 
	studentUID:String, //student who posts lesson
	tutorUID:String, //currently assigned tutor to the lesson
	initialTimestamp:{type:Date},//Time of initial creation of lesson by student
	deadlineHours:{type:Number,min:0},
	/*
	Deadline hours + created timestamp of subject lesson will give deadline time.
	*/
	numberOfHours:{type:Number,min:0},
	createdTimestamp:{type:Date},
	/*
	The created timestamp stores the timestamp when the entry is entered
	in the database. So a lesson entry of completedLesson will show when
	the lesson was completed, and a lesson entry of subjectLesson willl show
	when the lesson was initially created.
	*/
	updatedTimestamp:{type:Date}, //Stores the most recent time when a lesson is updated in any database  
	locked:{type:String, default:0}, //lesson is locked and cannot be assigned to any tutor
	lockTime:{type:Date}, //When the current tutor took the lesson
	unlockTime:{type:Date}, //When the most recent last tutor left the lesson
	privatePublicKey:Boolean //If the lesson is public or private	
});

subjectTimeTrackerSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

subjectTimeTrackerSchema.index({lessonUID:-1});

/*
globalJournalSchema
This will be the accounting journal of the main database. Initially it will only
have functions UGUR functions but with time other accounting things will be developed
to output all the accounting variables out from the admin panel.

Currency Unit: Dollar. Changing this would take quite some functions.

There can be three kinds of transaction types:
1. lesson vs wallet, a finantial transaction can be done to increase wallet credit or order 
a lesson.
2. lesson vs bank vs wallet, a wallet transaction can be done to get a lesson or trade the credits for
bank balance or a buy hours which will proceed through a helpdu account.

*/
var globalJournalSchema = new mongoose.Schema({
	transactionUID:String, //Basic transaction UID with ObjectID
	transactionType:String, //Will show if it is a wallet transaction or a lesson transaction
	lessonUID:String, //If it is a lesson transaction then lessonUID will be stored here
	transactioncomment:String, //Other comments will be written here
	initialTimestamp:{type:Date},
	createdTimestamp:{type:Date},
	updatedTimestamp:{type:Date,default:Date.now}, //Stores the most recent time when a lesson is updated in any database  
	/*
	Even though no entry would be updated currently only reverse entries will be made to remove a entry.
	But is still kept for the time being.
	*/
	debitAccount:String, //Account which has the debit entry
	creditAccount:String, //Account which has the credit entry
	amount:Number,
	isReversed:Boolean,
	blocked:Boolean
	/*
		When blocked will be true for a entry this means 2 things, 1 is that it is not visible to
		the client i.e. the client will not be sent this entry in get. Second this will not be included 
		in when creating account summary. Third if a payout is done for a tutor and something is
		blocked then it will not be processed at that moment.
		When a student posts a lesson the entry is updated in the main journal as well as tutor journal
		but it is blocked everywhere.
	*/
});

globalJournalSchema.index({transactionUID:-1});

globalJournalSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});


/*
* Debit Account - UID's account
* Credit Account - Other Transaction Account
* Debit Amount - Credit Account is giving to Debit Account
* Credit Amount - Debit Account is giving to Credit Account
Example
If UID is giving 200 to X account, then Debit Amount would be 0 and credit Amount would be 200.
*/
var specificLedgerSchema = new mongoose.Schema({
	transactionUID:String, //Basic transaction UID with ObjectID
	transactionType:String, //Will show if it is a wallet transaction or a lesson transaction
	lessonUID:String, //If it is a lesson transaction then lessonUID will be stored here
	transactionComment:String, //Other comments will be written here
	createdTimestamp:{type:Date},
	/*
	The created timestamp stores the timestamp when the entry is entered
	in the database. So a lesson entry of completedLesson will show when
	the lesson was completed, and a lesson entry of subjectLesson willl show
	when the lesson was initially created.
	*/
	updatedTimestamp:{type:Date}, //Stores the most recent time when a lesson is updated in any database  
	/*
	Even though no entry would be updated currently only reverse entries will be made to remove a entry.
	But is still kept for the time being.
	*/
	transactionAccount:String, //Account with which the transaction is taking place
	debitAmount:Number,
	creditAmount:Number,
	isReversed:Boolean,
	blocked:Boolean
	/*
		When blocked will be true for a entry this means 2 things, 1 is that it is not visible to
		the client i.e. the client will not be sent this entry in get. Second this will not be included 
		in when creating account summary. Third if a payout is done for a tutor and something is
		blocked then it will not be processed at that moment.
		When a student posts a lesson the entry is updated in the main journal as well as tutor journal
		but it is blocked everywhere.
	*/	
});

specificLedgerSchema.index({transactionUID:-1});

specificLedgerSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});


var currentWalletSchema = new mongoose.Schema({
	UID:String,
	isTutor:Boolean,
	currentBalance:Number,
	createdTimestamp:{type:Date},
	updatedTimestamp:{type:Date}
});

currentWalletSchema.index({UID:-1});

currentWalletSchema.pre('save', function(next){
  now = moment();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});


//Exporting Schemas
exports.lessonSchema = lessonSchema;
exports.notificationSchema = notificationSchema;
exports.subjectListSchema = subjectListSchema;
exports.subjectTimeTrackerSchema = subjectTimeTrackerSchema;
exports.globalJournalSchema = globalJournalSchema;
exports.specificLedgerSchema = specificLedgerSchema;
exports.currentWalletSchema = currentWalletSchema;
exports.messageSchema = messageSchema;

//Models
completedLessonModel = mongoose.model('completedLesson',lessonSchema,'completedLesson');
subjectList = mongoose.model('subjectList',subjectListSchema,'subjectList');
financeJournalModel = mongoose.model('financeJournal',globalJournalSchema,'financeJournal');
walletJournalModel = mongoose.model('walletJournal',globalJournalSchema,'walletJournal');
currentUIDWalletModel = mongoose.model('currentUIDWallet',currentWalletSchema,'currentUIDWallet');
messageModel=mongoose.model('messages',messageSchema,'messages');




//Exporting Models
exports.completedLessonModel = completedLessonModel;
exports.subjectList = subjectList;
exports.financeJournalModel = financeJournalModel;
exports.walletJournalModel = walletJournalModel;
exports.currentUIDWalletModel = currentUIDWalletModel;
exports.messageModel=messageModel;

