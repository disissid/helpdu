var mongoose=require('mongoose');
var db=mongoose.connection;


/*Developer Comments*/
/*

*forgotPassword(0:Has not requested, 1:Has Requested, 2:Request timed out)(!refresh[login][clickonResetRequestMail][resendResetRequest])
*Add validation for every field specially email, password, and institute

*/

var studentDBSchema=new mongoose.Schema({
	studentUID:{type:String},
	isTutor:Boolean,
	accountType:Number,
	name:String,
	fbLogin:Boolean,
	fbData:mongoose.Schema.Types.Mixed,
	email:String,
	password:String,
	createdTimestamp:{type:Date},
	updatedTimestamp:{type:Date},
	forgotPassword:{ type: Number, min: 0, max: 2 ,default:0},
	forgotPasswordTimestamp:{type:Date},
	forgotPasswordAuthCode:String
});

studentDBSchema.pre('save', function(next){
  now = new Date();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

studentDBSchema.index({studentUID:-1});

var tutorDBSchema=new mongoose.Schema({
	tutorUID:{type:String},
	isTutor:Boolean,
	accountType:Number,
	name:String,
	subjects:[String],
	instituteName:String,
	instituteEmail:String,
	tutorData:mongoose.Schema.Types.Mixed,
	tutorRatingPositive:{type:Number,default:0},
	tutorRatingNegative:{type:Number,default:0},
	tutorReviewObject:[mongoose.Schema.Types.Mixed],
	fbData:mongoose.Schema.Types.Mixed,
	email:String,
	password:String,
	tutorVerified:Boolean, //To be set true when the mail sent to insti mail is verified.
	tutorApproved:Boolean, //To be set true when the tutor has been approved for tutor requests
	createdTimestamp:{type:Date},
	updatedTimestamp:{type:Date},
	forgotPassword:{ type: Number, min: 0, max: 2, default:0},
	forgotPasswordTimestamp:{type:Date},
	forgotPasswordAuthCode:String
});

tutorDBSchema.pre('save', function(next){
  now = new Date();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

tutorDBSchema.index({tutorUID:-1});

var adminDBSchema=new mongoose.Schema({
	adminUID:String,
	name:String,
	email:String,
	password:String,
	accountType:Number,
	createdTimestamp:{type:Date},
	updatedTimestamp:{type:Date},
	forgotPassword:{ type: Number, min: 0, max: 2 ,default:0},
	forgotPasswordTimestamp:{type:Date},
	forgotPasswordAuthCode:String
});

adminDBSchema.pre('save', function(next){
  now = new Date();
  this.updatedTimestamp = now;
  if ( !this.createdTimestamp ) {
    this.createdTimestamp = now;
  }
  next();
});

adminDBSchema.index({adminUID:-1});


tutorDB=mongoose.model('tutorDB',tutorDBSchema,'tutorDB');
studentDB=mongoose.model('studentDB',studentDBSchema,'studentDB');
adminDB=mongoose.model('adminDB',adminDBSchema, 'adminDB');

exports.tutorDB=tutorDB;
exports.studentDB=studentDB;
exports.adminDB=adminDB;