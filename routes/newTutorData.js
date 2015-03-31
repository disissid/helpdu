var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection; 
var mail=require('../configFiles/mail.js');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');
var passport=require('passport');
var path = require('path');

//Database layer interactions
var databaseUGUR = require('../controllers/databaseUGURController.js');
var databaseAbstraction = require('../controllers/databaseAbstractionController.js');
var databaseTop = require ('../controllers/databaseTopController.js');
var tutorController = require('../controllers/tutorController.js');

router.post('/detailData',function(req,res){
	//exports.updateTutorDetails=function(tutorUID,updateObject,callback){
	var tutorUID = req.session.passport.user.tutorUID;
	var tutorUpdateObject = {
		'name':req.body.name,
		'instituteName':req.body.instituteName,
		'instituteEmail':req.body.instituteEmail,
		'tutorData':req.body.tutorData,
		'subjects':req.body.subjects,
		'email':req.body.email
	};

	tutorController.updateTutorDetails(tutorUID,tutorUpdateObject,function(returnedObject){
		res.json({'code':returnedObject.code,'message':returnedObject.message});
	});
});

router.get('/detailData',function(req,res){
	var tutorUID = req.session.passport.user.tutorUID;
	tutorDB.findOne({'tutorUID':tutorUID}, function(err,tutor){
		if(err){
			console.log('Error');
		}
		if(!tutor){
			console.log('Tutor not found');
		}
		if(tutor){
			res.json({
				'name':tutor.name,
				'instituteName':tutor.instituteName,
				'instituteEmail':tutor.instituteEmail,
				'tutorData':tutor.tutorData,
				'gender':tutor.fbData.gender,
				'fbUID':tutor.fbData.id,
				'email':tutor.email
			});
		}
	});
});

module.exports = router;