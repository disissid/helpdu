var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var db = mongoose.connection;
var passport=require('passport');
var userModels = require('../models/userModels.js');
var passportConfig=require('../configFiles/passportConfig.js');


//upload handling
var path=require('path');
var fs=require('fs');
var Busboy=require('busboy');




//Set max upload limit 5 mb here
//File upload change after putting amazon service here
//Do error handling here
router.post('/upload',function(req,res){
	var saveDirectory;
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		saveDirectory=path.join(__dirname,'..','public/data',path.basename(filename));
		file.pipe(fs.createWriteStream(saveDirectory));
	});
	busboy.on('finish', function() {
		//console.log(saveDirectory);
		res.json(saveDirectory);
	});
	req.pipe(busboy);
});


module.exports = router;
