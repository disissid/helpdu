var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
var crypto=require('crypto');
var userModels = require('../models/userModels.js');

exports.newTutor=function(name,fbData,email,uid,callback){
	var newTutor=new tutorDB({
		tutorUID:uid,
		isTutor:true,
		accountType:3,
		tutorRatingPositive:0,
		tutorRatingNegative:0,
		name:name,
		fbData:fbData, //Contains the fields stored by fb
		email:email,
		tutorApproved:false,
		tutorVerified:false,
		forgotPassword:0,
	});

	newTutor.save(function(err,tutor){
		if(err){
			callback({'code':'4','message':err});
		}
		else
		{
			callback({'code':'7','message':tutor}); 
		}
	});
};

exports.tutorAuth=function(uid,done){
	tutorDB.findOne({'tutorUID':uid}, function(err,tutor){
		if(err){
			return done(err);
		}
		if(!tutor){
			return done(null,false);
		}
		if(tutor){
			return done(null,tutor);
		}
	});
};

/*
{

Update Array has objects:
{
	updateItem :
	update :
}
}
*/

exports.updateTutorDetails=function(tutorUID,updateObject,callback){
	tutorDB.findOne({ tutorUID:tutorUID },function(err,returnedTutor){
		if(err){
			callback({'code':'4','message':err,'function':'tutorController/updateTutorDetails'});
		}
		else if(!returnedTutor){
			callback({'code':'4','message':'Tutor not found','function':'tutorController/updateTutorDetails'});
		}
		else if(returnedTutor){
			for(var key in updateObject){
				if(updateObject.hasOwnProperty(key)){
					switch(key){
						//To be filled
						case 'name': returnedTutor.name = updateObject[key];
						break;
						case 'instituteName': returnedTutor.instituteName = updateObject[key];
						break;
						case 'instituteEmail': returnedTutor.instituteEmail = updateObject[key];
						break;
						case 'subjects' : returnedTutor.subjects = updateObject[key];
						break;
						case 'tutorData': returnedTutor.tutorData = updateObject[key];
						break;

						//Automatic
						case 'accountType': returnedTutor.accountType = updateObject[key];
						break;
						case 'tutorVerified': returnedTutor.tutorVerified = updateObject[key];
						break;
						case 'tutorApproved': returnedTutor.tutorApproved = updateObject[key];
						break;
						case'tutorRatingPositive':returnedTutor.tutorRatingPositive = updateObject[key];
						break;
						case 'tutorRatingNegative' : returnedTutor.tutorRatingNegative = updateObject[key];
						break;
						case 'tutorReviewObject' : returnedTutor.tutorReviewObject = updateObject[key];
						break;
						case 'addTutorRatingPositive': returnedTutor.tutorRatingPositive++;
						break;
						case 'addTutorRatingNegative': returnedTutor.tutorRatingNegative++;
						break;
						case 'addTutorReview': returnedTutor.tutorReviewObject.push(updateObject[key]);
						break;

						//Already Filled
						case 'email': returnedTutor.email = updateObject[key];
						break;
						//Forgot Password Functionality
						case 'forgotPassword': returnedTutor.forgotPassword = updateObject[key];
						break;
						case 'forgotPasswordTimestamp': returnedTutor.forgotPasswordTimestamp = updateObject[key];
						break;
						case 'forgotPasswordAuthCode': returnedTutor.forgotPasswordAuthCode = updateObject[key];
						break;
					}
					
				}
			}
			if(updateObject.hasOwnProperty('password')){
				bcrypt.hash(updateObject.password,8,function(err,hash){
					returnedTutor.password = hash;
					returnedTutor.save(function(err){
						if(err){
							callback({'code':'4','message':err,'function':'studentController/updateStudentDetails'});
						}
						else{
							callback({'code':'7','message':'Succefully Updated Details'});
						}
					});	
				});
			}
			else{
				returnedTutor.save(function(err){
					if(err){
						callback({'code':'4','message':err,'function':'studentController/updateStudentDetails'});
					}
					else{
						callback({'code':'7','message':'Succefully Updated Details'});
					}
				});		
			}	
		}
	});			
};

//Implement the get directly in the route, this is being done because querying would be needed to be done on result.
