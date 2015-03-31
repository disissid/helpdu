var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var path=require('path');
var db = mongoose.connection;
var userModels = require('../models/userModels.js');
var passport=require('passport');
var passportConfig=require('../configFiles/passportConfig.js');
var mail=require('../configFiles/mail.js');
//remove unnecessary includes

var studentController = require('../controllers/studentController.js');

router.get('/register',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/register.html'));
});

router.get('/register-as-a-tutor',function(req,res){
	res.sendFile(path.normalize(__dirname+'/../public/tutor-register.html'));
});


router.post('/studentLocalRegister',function(req,res,next){
		passport.authenticate('local-student-register',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.json({'code':'5a','message':'Registeration Failure(User Exists)'});}
		req.logIn(user,function(err){
			if(err){return next(err);}
			//Set user status online
			return res.json({'code':'0','message':'/student/lesson'});
		});
	})(req,res,next);
});

//If a already authenticated user comes here then redirect him
router.get('/auth/tutorRegister/facebook',
	passport.authenticate('fb-tutor-register',{scope:'email',display:'popup'})
);

//Change the reply sent to the user
router.get('/auth/tutorRegister/facebook/callback',function(req,res,next){
	passport.authenticate('fb-tutor-register',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.redirect('/error');}
		req.logIn(user,function(err){
			if(err){return next(err);}
			return res.redirect('/newTutor/fillDetails');
		});
	})(req,res,next);
});

//If a already authenticated user comes here then redirect him
router.get('/auth/studentRegister/facebook',
	passport.authenticate('fb-student-register',{scope:'email',display:'popup'})
);

//Change the reply sent to the user
router.get('/auth/studentRegister/facebook/callback',function(req,res,next){
	passport.authenticate('fb-student-register',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.json({'code':'2','message':'null'});}
		req.logIn(user,function(err){
			if(err){return next(err);}
			//set user status online
			return res.redirect('/student/lesson');
		});
	})(req,res,next);
});


module.exports = router;



/*
Client based facebook registeration/login code
router.post('/tutorRegister',function(req,res,next){
		passport.authenticate('fb-tutor-register',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.send({'code':'5a','message':'Registeration Falliure(User Exists)'});}
		if(user){
			var mailBody='Hello <b>'+user.name+'</b>,<br>Woah what do we have here!? A new dumb student who cannot solve homework on his own? Dont you worry, what<br>are we fucking here for. We made this website to earn moolaahs from dumbfucks like you. Now quickly get your ass on our<br> brilliant website get your shitty homework done and make us rich<br>Thank You.<br>Btw here is your username in case you forgot<br>Username: '+user.email;
			var mailOptions = {
    			from: 'Admin HelpDU <mail.helpdu@gmail.com>', // sender address
    			to: user.email, // list of receivers
    			subject: 'Welcome Aboard', // Subject line
    			html: mailBody // html body
			};
			mail.sendMail(mailOptions);
			
			return res.send({'code':'0','message':'/'});
		}
	})(req,res,next);
});

router.post('/studentFbRegister',function(req,res,next){
		passport.authenticate('fb-student-register',function(err,user,info){
		if(err){return next(err);}
		if(!user){return res.send({'code':'5a','message':'Registeration Falliure(User Exists)'});}
		if(user){
			var mailBody='Hello <b>'+user.name+'</b>,<br>Woah what do we have here!? A new dumb student who cannot solve homework on his own? Dont you worry, what<br>are we fucking here for. We made this website to earn moolaahs from dumbfucks like you. Now quickly get your ass on our<br> brilliant website get your shitty homework done and make us rich<br>Thank You.<br>Btw here is your username in case you forgot<br>Username: '+user.email;
			var mailOptions = {
    			from: 'Admin HelpDU <mail.helpdu@gmail.com>', // sender address
    			to: user.email, // list of receivers
    			subject: 'Welcome Aboard', // Subject line
    			html: mailBody // html body
			};
			mail.sendMail(mailOptions);
			
			return res.send({'code':'0','message':'/'});
		}
	})(req,res,next);
});

*/

