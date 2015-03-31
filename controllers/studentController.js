var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
var crypto=require('crypto');
var userModels = require('../models/userModels.js');

exports.newStudent=function(name,fbLogin,fbData,email,password,uid,callback){
	if(fbLogin===false)
	{
		bcrypt.hash(password,8,function(err,hash){ //Generates bcrypt hash, change number as per load & security
			var newStudent=new studentDB({
				studentUID:uid,
				isStudent:false,
				accountType:0,
				name:name,
				fbLogin:false,
				email:email,
				password:hash,
				forgotPassword:0,
			});

			newStudent.save(function(err,student){
				if(err){
					callback({'code':'4','message':err});
				}
				else
				{
					callback({'code':'7','message':student}); 
				}
			});
		});	
	}

	if(fbLogin===true)
	{
			var newStudent=new studentDB({
				studentUID:uid,
				isStudent:false,
				accountType:0,
				name:name,
				fbLogin:true,
				fbData:fbData, //Contains the fields stored by fb
				email:email,
				forgotPassword:0,
			});

			newStudent.save(function(err,student){
				if(err){
					callback({'code':'4','message':err});
				}
				else
				{
					callback({'code':'7','message':student});
				}
			});
	}
};


exports.studentAuth=function(uid,password,done){
	studentDB.findOne({'studentUID':uid}, function(err,student){
		if(err){return done(err);}
		if(!student){
			return done(null,false);
		}
		if(student){
			if(!student.fbLogin){
				bcrypt.compare(password, student.password, function(err, res) {
				if(!res){return done(null,false);}
				if(res){return done(null,student);}
				});
			}
			else if(student.fbLogin)
				return done(null,student);
		}
	});
};

exports.updateStudentDetails=function(studentUID,updateObject,callback){
	studentDB.findOne({ studentUID:studentUID },function(err,returnedStudent){
		if(err){
			callback({'code':'4','message':err,'function':'studentController/updateStudentDetails'});
		}
		else if(!returnedStudent){
			callback({'code':'4','message':'Student does not exist','function':'studentController/updateStudentDetails'});
		}
		else if(returnedStudent){
			for(var key in updateObject){
				if(updateObject.hasOwnProperty(key)){
					switch(key){
						//To be filled
						case 'name': returnedStudent.name = updateObject[key];
						break;
						case 'instituteName': returnedStudent.instituteName = updateObject[key];
						break;
						case 'instituteEmail': returnedStudent.instituteEmail = updateObject[key];
						break;
						case 'studentData': returnedStudent.studentData = updateObject[key];
						break;

						//Automatic
						case 'accountType': returnedStudent.accountType = updateObject[key];
						break;
						case 'studentVerified': returnedStudent.studentVerified = updateObject[key];
						break;
						case 'studentApproved': returnedStudent.studentApproved = updateObject[key];
						break;

						//Already Filled
						case 'email': returnedStudent.email = updateObject[key];
						break;

						//Forgot Password Functionality
						case 'forgotPassword': returnedStudent.forgotPassword = updateObject[key];
						break;
						case 'forgotPasswordTimestamp': returnedStudent.forgotPasswordTimestamp = updateObject[key];
						break;
						case 'forgotPasswordAuthCode': returnedStudent.forgotPasswordAuthCode = updateObject[key];
						break;
					}
				}
			}
			if(updateObject.hasOwnProperty('password')){
				bcrypt.hash(updateObject.password,8,function(err,hash){
					returnedStudent.password = hash;
					returnedStudent.save(function(err){
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
				returnedStudent.save(function(err){
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


