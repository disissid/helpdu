//express
var express = require('express');
var router = express.Router();
//mongoose
var mongoose=require('mongoose');
var db = mongoose.connection;
//General node
var path=require('path');


var userModels = require('../models/userModels.js');
var passport=require('passport');
var passportConfig=require('../configFiles/passportConfig.js');
//remove unnecessary includes 

router.get('/login',function(req,res){
	res.redirect('/');
});

router.post('/studentLocalLogin',function(req,res,next){
	passport.authenticate('local-student-login',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.json({'code':'2','message':'null'});}
		req.logIn(user,function(err){
			if(err){return next(err);}
			//call to set student status online
			return res.json({'code':'0','message':'/student/lesson'});
		});
	})(req,res,next);
});


//If a already authenticated user comes here then redirect him
router.get('/auth/login/facebook',
	passport.authenticate('fb-login',{scope:'email',display:'popup'})
);

router.get('/auth/login/facebook/callback',function(req,res,next){
	passport.authenticate('fb-login',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.redirect('/error');}
		req.logIn(user,function(err){
			if(err){return next(err);}
			if(user.accountType == 0){
				res.redirect('/student/lesson');
				//call to set student status online
			}
			else if(user.accountType == 1){
				res.redirect('/tutor/lesson');
				//call to set tutor status online
			}
			else if(user.accountType == 3){
				res.redirect('/newTutor/fillDetails');
				//call to set tutor status online
			}
		});
	})(req,res,next);
});

/*Login*/
router.get('/adminLogin',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/admin-login.html'));
});

//Comment this route in production. IMPORTANT
/*
router.get('/createAdmin/:email/:password/:name', function(req,res){
	adminModel.newAdmin(req.params.name,req.params.email,req.params.password,function(admin){
		res.send(admin);
	});
});
*/	

router.post('/adminLocalLogin',function(req,res,next){
	passport.authenticate('local-admin-login',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.json({'code':'2','message':'null'});}
		req.logIn(user,function(err){
			if(err){return next(err);}
			return res.send({'code':'0','message':'/admin/dashboard'});
		});
	})(req,res,next);
});


module.exports = router;

/*
Client based facebook registeration/login code

router.post('/studentFbLogin',function(req,res,next){
	passport.authenticate('fb-student-login',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.send({'code':'2','message':'null'});}
		req.logIn(user,function(err){
			if(err){return next(err);}
			return res.send({'code':'0','message':'/profile'});
		});
	})(req,res,next);
});

router.post('/tutorLogin',passport.authenticate('fb-tutor-login',
	{
		successRedirect:'/tutor/ishan',
		failureRedirect:'/login'
	})
);
*/