var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session=require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local');


//File includes
var passportConfig=require('./configFiles/passportConfig.js');

var databaseAPI = require('./routes/databaseAPI');

var adminRoutes = require('./routes/adminRoutes');
var adminDashboard = require('./routes/adminDashboard.js'); 
var adminDashboardData = require('./routes/adminDashboardData.js');

var login=require('./routes/login');
var register=require('./routes/register');
//var uploads = require('./routes/uploads');

var common = require('./routes/common.js');

var student = require('./routes/student.js');
var studentData = require('./routes/studentData.js');
var tutor = require('./routes/tutor.js');
var tutorData = require('./routes/tutorData.js');
var newTutor = require('./routes/newTutor.js');
var newTutorData = require('./routes/newTutorData.js');

var app = express();
/*Comment Section*/

/*
*helpdu temporary financial account is md5 hash of 'ishan'->6f6a4b9e983c1de1ae719bb187de13c7.
*helpdu permanent financial account is md5 hash of 'worldDomination'->4aee963f826c91ac239fba33dfbbe3ca.
*helpdu hours wallet account is md5 hash of 'hemant'->'17563740df9a804bc5e3b31c5cb58984'.


Errors List:
    code:0,1,2,3,4, message:''}
    0:Get request to get data
    1:Data is being Sent in Message
    2:Authentication failed
    3:Authentication required to access
    4:Unexpected Error (Error in Messsage)
    5:Registeration failed
    6:User is Authorized
    7:Operation was successful
    8:Crtical Error
    9:Payment Gateway Failure
    11: Sufficient Balance not available
    12: Lesson not found
    13: Tutor not found


    Account Types:
    0: Student
    1: Tutor
    2: Admin
    3: Unapproved Tutor or written as tutorX is authentication confirm
 
    Payment Gateway Details:
    Test API keys
    Key Id : rzp_test_2qgTa94zzRS0G7
    Key Secret : Y5lK9AQ4PJBLGz535o80kyq9

 */



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{index : false}));


app.use(session({
    secret:'bitches',
    resave:false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/',databaseAPI);

app.use('/',login);
app.use('/',register);
//app.use('/',uploads);

//app.use('/student',passportConfig.accessControl('student'),student);
//app.use('/studentData',passportConfig.checkAuth('student'),studentData);


app.use('/tutor',passportConfig.accessControl('tutor'),tutor);
app.use('/tutorData',passportConfig.checkAuth('tutor'),tutorData);

app.use('/newTutor',passportConfig.accessControl('newTutor'),newTutor);
app.use('/newTutorData',passportConfig.checkAuth('newTutor'),newTutorData);

app.use('/admin',passportConfig.accessControl('admin'),adminDashboard);
app.use('/adminData',passportConfig.checkAuth('admin'),adminDashboardData);
app.use('/adminRoutes',passportConfig.checkAuth('admin'),adminRoutes);

app.use('/',common); //All common routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
