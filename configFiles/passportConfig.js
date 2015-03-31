var session=require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose=require('mongoose');
var db = mongoose.connection;
var userModels = require('../models/userModels.js');
var studentController = require('../controllers/studentController.js');
var adminController = require('../controllers/adminController.js');
var tutorController = require('../controllers/tutorController.js');
var crypto=require('crypto');
var path = require('path');


//Also make the passport cookie ssl based and set time in it

//In local-student-strategy check to see 
passport.use('local-student-login',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
		md5.update(username);
		uid=md5.digest('hex');
		studentController.studentAuth(uid,password,function(param1,param2){ //Param 1: Null, Param 2: either false or true depending on the logged in status
			return done(param1,param2);
		});
	})
);

passport.use('local-student-register',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){ //here username denotes the email because we take the email as the username
		var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
		md5.update(username);
		uid=md5.digest('hex');
		studentDB.findOne({'studentUID':uid},function(err,student){
			if(err){
				return done(err);
			}
			if(student){
				return done(null,false);
			}
			if(!student){
				studentController.newStudent(req.body.name,false,undefined,username,password,uid,function(returnedObject){
					if(returnedObject.code==7)
						return done(null,returnedObject.message);
					else
						return done(null,false);
				});
			}
		});
	})
);


passport.use('fb-login',new FacebookStrategy({
    clientID: '693880737394303',
    clientSecret: 'ad8cef15cbe512dd08675a70fbf0a9ab',
    callbackURL: "http://192.168.1.100:666/auth/login/facebook/callback"
  },
	function(accessToken, refreshToken, profile, done) {
		var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
		md5.update(profile._json.id);
		uid=md5.digest('hex');
		studentController.studentAuth(uid,undefined,function(param1,param2){ //Param 1: Null, Param 2: either false or true depending on the logged in status
			if(param2){
				return done(param1,param2);
			}
			else if(!param2){
				tutorController.tutorAuth(uid,function(param1,param2){ //Param 1: Null, Param 2: either false or true depending on the logged in status
					return done(param1,param2);
				});
			}
		});
	})
);


passport.use('fb-student-register',new FacebookStrategy({
    clientID: '693880737394303',
    clientSecret: 'ad8cef15cbe512dd08675a70fbf0a9ab',
    callbackURL: "http://192.168.1.100:666/auth/studentRegister/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
	md5.update(profile._json.id);
	uid=md5.digest('hex');
	tutorDB.findOne({'tutorUID':uid},function(err,tutor){
		if(err){
			return done(err);
		}
		if(tutor){
			return done(null,false);
		}
		if(!tutor){
			studentDB.findOne({'studentUID':uid},function(err,student){
				if(err){
					return done(err);
				}
				if(student){
					return done(null,false);
				}
				if(!student){
					studentController.newStudent(profile._json.name,true,profile._json,profile._json.email,undefined,uid,function(returnedObject){
						if(returnedObject.code==7)
							return done(null,returnedObject.message);
						else
							return done(null,false);
					});
				}
			});
		}
	});
  }
));


passport.use('fb-tutor-register',new FacebookStrategy({
    clientID: '693880737394303',
    clientSecret: 'ad8cef15cbe512dd08675a70fbf0a9ab',
    callbackURL: "http://192.168.1.100:666/auth/tutorRegister/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	var md5=crypto.createHash('md5');	//Generates MD5 hash of the unique email
	md5.update(profile._json.id);
	uid=md5.digest('hex');
	
	studentDB.findOne({'studentUID':uid},function(err,student){
		if(err){
			return done(err);
		}
		if(student){
			return done(null,false);
		}
		if(!student){
			tutorDB.findOne({'tutorUID':uid},function(err,tutor){
				if(err){
					return done(err);
				}
				if(tutor){
					return done(null,false);
				}
				if(!tutor){
					tutorController.newTutor(profile._json.name,profile._json,profile._json.email,uid,function(returnedObject){
						if(returnedObject.code==7)
							return done(null,returnedObject.message);
						else
							return done(null,false);
					});
				}
			});
		}
	});
  }
));

passport.use('local-admin-login',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		adminController.adminAuth(username,password,done);//
	})
);

passport.serializeUser(function(user, done) {
	var store;
	if(user.accountType == 0){
		store={'studentUID':user.studentUID,'name':user.name,'email':user.email,'accountType':user.accountType};
	}
	else if(user.accountType == 1){
		store={'tutorUID':user.tutorUID,'name':user.name,'email':user.email,'accountType':user.accountType};
	}
	else if(user.accountType == 2){
		store={'adminUID':user.adminUID,'name':user.name,'email':user.email,'accountType':user.accountType};
	}
	else if(user.accountType == 3){
		store={'tutorUID':user.tutorUID,'name':user.name,'email':user.email,'accountType':user.accountType};
	}
	done(null, store);
});


passport.deserializeUser(function(store, done) {
	if(store.accountType == 0){
		studentDB.find({'studentUID':store.studentUID},function(err,user){
			done(null,user);
		});
	}
	else if(store.accountType == 1){
		tutorDB.find({'tutorUID':store.tutorUID},function(err,user){
			done(null,user);
		});
	}
	else if(store.accountType == 2){
		adminDB.find({'adminUID':store.adminUID},function(err,user){
			done(null,user);
		});
	}
	else if(store.accountType == 3){
		tutorDB.find({'tutorUID':store.tutorUID},function(err,user){
			done(null,user);
		});
	}
});



exports.accessControl=function(user){
	if(user=='student'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 0){
				next();
			}
			else{
				res.redirect('/authenticationError');
			}
		};
	}
	else if(user=='tutor'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 1){
				next();
			}
			else{
				res.redirect('/authenticationError');
			}
		};		
	}
	else if(user=='admin'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 2){
				next();
			}
			else{
				res.redirect('/authenticationError');
			}
		};
	}
	else if(user=='newTutor'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 3){
				next();
			}
			else{
				res.redirect('/authenticationError');
			}
		};
	}
};


exports.checkAuth=function(user){
	if(user=='student'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 0){
				next();
			}
			else{
				res.json({'code':'3','message':'Authentication Required'});
			}
		};
	}
	else if(user=='tutor'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 1){
				next();
			}
			else{
				res.json({'code':'3','message':'Authentication Required'});
			}
		};		
	}
	else if(user=='admin'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 2){
				next();
			}
			else{
				res.json({'code':'3','message':'Authentication Required'});
			}
		};
	}
	else if(user=='newTutor'){
		return function(req,res,next){
			if(req.isAuthenticated() && req.session.passport.user.accountType == 3){
				next();
			}
			else{
				res.json({'code':'3','message':'Authentication Required'});
			}
		};
	}
};

exports.returnAuthStatus=function(req,callback){
	if(req.isAuthenticated()){
		if(req.session.passport.user.accountType == 0){
			callback({'code':6,'message':'/student/lesson'});
		}
		else if(req.session.passport.user.accountType == 1){
			callback({'code':6,'message':'/tutor/lesson'});
		}
		else if(req.session.passport.user.accountType == 2){
			callback({'code':6,'message':'/admin/dashboard'});
		}
		else if(req.session.passport.user.accountType == 3){
			callback({'code':6,'message':'/newTutor/fillDetails'});
		}
		else{
			callback({'code':4,'message':'User type does not exist'});
		}
	}
	else{
		callback({'code':3,'message':'Authentication Error'});
	}
};

/*
Client based facebook registeration/login code
passport.use('fb-student-register',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		studentDB.findOne({'email':username},function(err,student){
			if(err){
				return done(err);
			}
			if(student){
				return done(null,false);
			}
			if(!student){
				sDB.newStudent(req.body.name,true,req.body.fbData,username,undefined,function(student){
					return done(null,student);
				});
			}
		});
	})
);

passport.use('fb-student-login',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		tDB.auth(username,passport,done);
	})
);

passport.use('fb-tutor-register',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		tutorDB.findOne({'email':username},function(err,tutor){
			if(err){
				return done(err);
			}
			if(tutor){
				return done(null,false);
			}
			if(!tutor){
				tDB.newTutor(req.body.name,req.body.fbData,username,undefined,function(tutor){
					return done(null,tutor);
				});
			}
		});
	})
);

passport.use('fb-tutor-login',new LocalStrategy({
		passReqToCallback:true,
		usernameField:'email'
	},
	function(req,username,password,done){
		tutorDB.findOne({'email':username},function(err,tutor){
			if(err){
				return done(err);
			}
			if(tutor){
				return done(null,false);
			}
			if(!tutor){
				tDB.newTutor(req.body.name,req.body.fbData,username,undefined,function(tutor){
					return done(null,tutor);
				});
			}
		});
	})
);

*/
