var userModels = require('../models/userModels.js');
var databaseModels = require('../models/databaseModels.js');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var crypto=require('crypto');


exports.newAdmin=function(name,email,password,callback){
	bcrypt.hash(password,8,function(err,hash){ //Generates bcrypt hash, change number as per load & security
		var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
		md5.update(email);
		uid=md5.digest('hex');
		var newAdmin=new adminDB({
			adminUID:uid,
			name:name,
			accountType:2,
			email:email,
			password:hash,
			forgotPassword:0,
		});

		newAdmin.save(function(err,admin){
			if(err){
				callback({'code':'4','message':err});
			}
			else
			{
				callback({'code':'7','message':admin});
			}
		});
	});	
};

exports.adminAuth=function(username,password,done){
	adminDB.findOne({'email':username}, function(err,admin){
		if(err){return done(err);}
		if(!admin){
			return done(null,false);
		}
		if(admin){
			bcrypt.compare(password, admin.password, function(err, res) {
				if(!res){return done(null,false);}
				if(res){return done(null,admin);}
			});
		}
		else{
			return done(null,false);
		}
	});
};


/*Admin Functionality*/
exports.addSubject=function(name,callback){
	subjectList.findOne({subjectName:name},function(err,subject){
		if(err){
			//error handle
		}
		else if(!subject){
			var newSubjectList=new subjectList({
			subjectName:name
			});
			newSubjectList.save(function(err){
				if(err){
					callback(3);
				}
				else{
					callback(0);
				}
			});
		}
	});
};

exports.removeSubject=function(subjectName,callback){
	subjectList.findOne({subjectName:subjectName}, function(err,subject){
		if(err){
			callback(3);
		}
		else if(subject){
			subject.remove(function(err){
				if(err){
					callback(3);
				}
				else{
					callback(0);
				}
			});
		}
	});
};

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


/*Admin Functionality*/