//file uploading need to be done via amazon s3


var indexApp = angular.module('indexApp',['directives','angularFileUpload','services','angularMaterialPreloader','customFilter']);


indexApp.controller('NavCtrl', function($scope,loggedIn) {

    $scope.studentLoggedIn=false;
    $scope.tutorLoggedIn=false;
    $scope.anyoneLoggedIn=loggedIn.anyoneLoggedIn();

    if(loggedIn.whoLoggedIn()==0){
        $scope.studentLoggedIn=true;
    }else{
        if(loggedIn.whoLoggedIn()==1){
            $scope.tutorLoggedIn=true;
        }
    }

    $scope.tutors=loggedIn.getOnlineTutorList();

});


indexApp.controller('MenuCtrl',function($scope,$http,$window,anchorSmoothScroll,$location){

    $scope.gotoElement = function (eID){
        console.log(eID);
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

    };

    $scope.materialPreloader = false;

    /*$scope.getStudentProfileData=function(){
        $scope.Authenticated=false;

        $http.get("/studentProfileData")
            .success(function (data, status, headers, config)
            {   console.log(data);
                if(data.code=='3') {
                    $window.location.href = '/login';
                }else{if(data.code=='6')
                    $scope.Authenticated=true;
                }
            })
            .error(function (data, status, headers, config) {

            });
    }*/






   $scope.menuOpened = false;
    $scope.clicked = false;

    $scope.toggleMenu = function() {
        $scope.menuOpened = !($scope.menuOpened);
        $scope.clicked =true;
        // Important part in the implementation
        // Stopping event propagation means window.onclick won't get called when someone clicks
        // on the menu div. Without this, menu will be hidden immediately
    };

    $window.onclick = function() {
        if ($scope.boxOpened) {
            $scope.boxOpened = false;
            // You should let angular know about the update that you have made, so that it can refresh the UI
            $scope.$apply();
        }
    }

    $scope.boxOpened = false;

    $scope.toggleBox = function(id) {
        $scope.boxId=id;
        $scope.boxOpened=!( $scope.boxOpened );

        // Important part in the implementation
        // Stopping event propagation means window.onclick won't get called when someone clicks
        // on the menu div. Without this, menu will be hidden immediately
    };
});

indexApp.controller('studentLessonCtrl',function($scope,$http){
    $http.get("/studentData/lessonData")
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.lessons=data.message;
        })
        .error(function (data, status, headers, config) {

        });
});

indexApp.controller('TutorPublicLessonCtrl',function($scope,$http){
    $http.get("/tutorData/lessonData")
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.lessons=data.message;
        })
        .error(function (data, status, headers, config) {

        });
});

indexApp.controller('TutorLessonCtrl',function($scope,$http){
    $http.get("/tutorData/publicLessons")
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.publicLessons=data.message;
        })
        .error(function (data, status, headers, config) {

        });
});





indexApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});





indexApp.controller("LoginController",function($scope,$http,$window){
    $scope.submitData=function(){
        var data={
            'email':$scope.user.email,
            'password':$scope.user.password
        };

        $http({
            method: 'POST',
            url:'/studentLocalLogin',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data:data
        }).success(function (data, status, headers, config)
        {
            if(data.code==2)
            {
                alert('Authentication Failed');
            }
            else if(data.code==0)
            {
                $window.location.href =data.message;
            }
        })
            .error(function (data, status, headers, config) {

            });
        $scope.user.email='';
        $scope.user.password='';

    };
});


//file uploading need to be done via amazon s3

indexApp.controller("FileCtrl",function($scope,$upload) {
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: '/lesson/upload/',
                headers: {'Content-Type': 'multipart/form-data'},
                file: $file,
                progress: function(e){}
            }).then(function(data, status, headers, config) {
                $scope.uploadedFile.url=data;
                console.log(data);
            });
        }};
});

indexApp.controller("RequestLessonCtrl",function($scope,$http){


    $http.get("/subjectList")
        .success(function (data, status, headers, config)
        {
            console.log("Subject list");
            console.log(data);
            $scope.subjectList=data;
        })
        .error(function (data, status, headers, config) {

        });

    $scope.uploadedFile={
        url:""
    };
    $scope.submitData=function(){
        var data={
            'subject':$scope.subject,
            'message':$scope.message,
            'fileLinks':$scope.uploadedFile.url,              //loader/progress bar need to be added for file uploading(request lesson button should be disabled)
            'deadlineHours':$scope.deadline,
            'numberOfHours':$scope.hours,
            'privatePublicKey':$scope.mode
        };
        console.log(data);
        $http.post("/studentData/uploadLesson/",data)
            .success(function (data, status, headers, config)
            {
                    console.log("lesson uploaded");
                    console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };

});




indexApp.controller('MessageCtrl',function($scope){
   $scope.sender=true;
});


indexApp.controller('TutorRegistrationStepsCtrl',function($scope,$http){
    $scope.newTutor={};
    $http.get("/newTutorData/detailData")
        .success(function (data, status, headers, config) {
            console.log(data);
           $scope.newTutor.name=data.name;
            $scope.newTutor.email=data.email;
            $scope.newTutor.major=data.tutorData.major;
            $scope.newTutor.yearOfGrad=data.tutorData.yearOfGrad;
            $scope.newTutor.teachingExp=data.tutorData.teachingExp;
            $scope.newTutor.extracurrInterests=data.tutorData.extracurrInterests
            $scope.step=data.tutorData.step;
            $scope.value=$scope.step;
           $scope.newTutor.instiEmail=data.instituteEmail;
            $scope.newTutor.instiName=data.instituteName;
            $scope.selection=data.subjects;
        })
        .error(function (data, status, headers, config) {

        });



    $scope.value=1;
    $scope.step=1;



    $scope.check=function(i){
        if($scope.step>=i){
            $scope.value=i;
        }
    }

    $http.get("/subjectList")
        .success(function (data, status, headers, config)
        {
            console.log("Subject list");
            console.log(data);
            $scope.subjectList=data;
        })
        .error(function (data, status, headers, config) {

        });

    $scope.selection=[];
    // toggle selection for a given employee by name
    $scope.toggleSelection = function toggleSelection(studentName) {
        var idx = $scope.selection.indexOf(studentName);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(studentName);
        }
    };

    $scope.submitData=function(){

        var data= {
            'tutorData':{
                'major':$scope.newTutor.major,
                'yearOfGrad':$scope.newTutor.yearOfGrad,
                'teachingExp':$scope.newTutor.teachingExp,
                'extracurrInterests':$scope.newTutor.extracurrInterests,
                'step':$scope.step
            },
            'name':$scope.newTutor.name,
            'email':$scope.newTutor.email,
            'instituteEmail':$scope.newTutor.instiEmail,
            'instituteName':$scope.newTutor.instiName,
            'subjects':$scope.selection
        }

        console.log(data);

        $http.post("/newTutorData/detailData",data)
            .success(function (data, status, headers, config) {
                console.log(data);
                $scope.value++;
                if($scope.step<$scope.value){
                    $scope.step=$scope.value;
                }
            })
            .error(function (data, status, headers, config) {

            });


    }






});

indexApp.controller('TutorProfileCtrl',function(){});

indexApp.controller("RegisterController",function($scope,$http,$window,$interval){
    $scope.registered=false;
    $scope.submitData=function() {
        var data = {
            'name': $scope.user.name,
            'email': $scope.user.email,
            'password': $scope.user.password
        };

        $http.post("/studentLocalRegister", data)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data.code==2)
                {
                    alert('Authentication Failed');
                }
                else if(data.code==0)
                {   $scope.registered=true;
                    var redirect=function(){$window.location.href =data.message;}

                    $interval(function(){redirect();},3000);

                }
            })
            .error(function (data, status, headers, config) {

            });
    };

});


indexApp.controller('BuyHourCtrl',function($scope,$http){

    $scope.submitData=function(numberOfHours) {
        var data = {
            'numberOfHours':numberOfHours
        };
        console.log(data);

        $http.post("/studentData/buyHours", data)
            .success(function (data, status, headers, config) {
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };
});


indexApp.controller('AuthenticationErrorCtrl',function($scope,$interval,$window){
    $scope.redirectToHome =function(){
        var redirect=function(){$window.location.href ='../';}

        $interval(function(){redirect();},3000);
    };
});

indexApp.controller('StudentBillingCtrl',function($scope,$http){
    $http.get("/studentData/walletData")
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.bills=data.message;
        })
        .error(function (data, status, headers, config) {

        });

    $http.get("/studentData/walletBalance").success(function (data, status, headers, config)
    {  console.log(data);
        $scope.balance=data[0].currentBalance;
    })
        .error(function (data, status, headers, config) {

        });
});

indexApp.controller('SearchCtrl',function($scope,$http){
    $scope.search={};
    $scope.searchData=function() {
        var data={
            'subject':$scope.search.query
        }
        console.log(data);

        $http.post("/search", data)
            .success(function (data, status, headers, config) {
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };
})

indexApp.controller('StudentLessonPageCtrl',function($scope,$http,$location){
    var lessonUID = $location.path().split("/")[3];
    console.log(lessonUID);
    var data={
        'lessonUID':lessonUID
    }
    $http.post("/studentData/lessonPageData",data)
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.lessonPage=data.message;


            if($scope.lessonPage.tutorUID != 'false'){
                var data={
                    'tutorUID':$scope.lessonPage.tutorUID
                }
                console.log(data);

                $http.post("/studentData/getTutorDetails", data)
                    .success(function (data, status, headers, config) {
                        console.log(data.message.name);
                        $scope.lessonPage.tutorName=data.message.name;
                    })
                    .error(function (data, status, headers, config) {

                    });

                var data1={
                    'studentUID':$scope.lessonPage.studentUID,
                    'lessonUID':$scope.lessonPage.lessonUID
                }

                $http.post("/studentData/checkReviewStatus",data1)
                    .success(function (data, status, headers, config)
                    {
                        $scope.review=data.message;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {

                    });
            }
        })
        .error(function (data, status, headers, config) {

        });





    $scope.submitData=function(){

        var data={
            'subject':$scope.lessonPage.subject,
            'lessonUID':$scope.lessonPage.lessonUID,
            'tutorUID':$scope.lessonPage.tutorUID,
            'tutorRating':$scope.review.vote,
            'tutorReview':$scope.review.message || ' '
                                                                               /*'flaggedLesson':$scope.review.flag || false*/
        }

        console.log(data);

        $http.post("/studentData/postReview", data)
            .success(function (data, status, headers, config) {
                console.log(data);


                var data1={
                    'studentUID':$scope.lessonPage.studentUID,
                    'lessonUID':$scope.lessonPage.lessonUID
                }


                $http.post("/studentData/checkReviewStatus",data1)
                    .success(function (data, status, headers, config)
                    {
                        $scope.review=data.message;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {

                    });
            })
            .error(function (data, status, headers, config) {

            });

    };

    $scope.flagLesson=function(){
        var data={
            'tutorUID':$scope.lessonPage.tutorUID,
            'lessonUID':$scope.lessonPage.lessonUID
        }

        $http.post("/studentData/flagLesson",data)
            .success(function (data, status, headers, config)
            {
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    }
});


indexApp.controller('TutorLessonPageCtrl',function($scope,$http){

    $http.get("")
        .success(function (data, status, headers, config)
        {  console.log(data);
            $scope.lessonPage=data.message;
        })
        .error(function (data, status, headers, config) {

        });

    $scope.submitData=function(){

        var data={
            'vote':$scope.review.vote,
            'message':$scope.review.message || '',
            'flaggedLesson':$scope.review.flag || false
        }

        console.log(data);
    };
});

indexApp.controller("SubmitLessonCtrl",function($scope,$http){

    $scope.uploadedFile={
        url:""
    };

    $scope.submitData=function(){
        var data={
            'message':$scope.submitLesson.message,
            'solutioninks':$scope.uploadedFile.url             //loader/progress bar need to be added for file uploading(request lesson button should be disabled
        };
        console.log(data);
        $http.post("/studentData/uploadLesson/",data)
            .success(function (data, status, headers, config)
            {
                console.log("lesson uploaded");
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };

});

/*indexApp.config(function(FacebookProvider) {
 // Set your appId through the setAppId method or
 // use the shortcut in the initialize method directly.
 FacebookProvider.init('693880737394303');
 })

 .controller('authenticationCtrl', function($scope, Facebook,$http) {



 $scope.login = function() {
 // From now on you can use the Facebook service just as Facebook api says
 Facebook.login(function(response) {
 // Do something with response.
 $scope.getLoginStatus();
 },{'scope':'email'});
 };

 $scope.logout= function(){
 Facebook.logout(function(response) {
 // Person is now logged out
 $scope.getLoginStatus();
 $scope.user='';
 });
 }

 $scope.getLoginStatus = function() {
 Facebook.getLoginStatus(function(response) {
 if(response.status === 'connected') {
 console.log(response);
 $scope.loggedIn = true;
 $scope.me();
 } else {
 $scope.loggedIn = false;
 }
 });
 };

 $scope.me = function() {
 Facebook.api('/me', function(response) {
 $scope.user = response;
 console.log($scope.user);
 var data = {
 'name': $scope.user.name,
 'email': $scope.user.email,
 'password': 'default',
 'fbData':{'fbUID': $scope.user.id
 }
 };
 console.log(data);
 $http.post("/studentFbRegister", data)
 .success(function (data, status, headers, config) {
 console.log(data);
 })
 .error(function (data, status, headers, config) {

 });
 });
 };

 $scope.$watch(function() {
 // This is for convenience, to notify if Facebook is loaded and ready to go.
 return Facebook.isReady();
 }, function(newVal) {
 // You might want to use this to disable/show/hide buttons and else
 $scope.facebookReady = true;
 });
 });

 */





//client-side registration with facebook

/*indexApp.config(function(FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('693880737394303');
})

    .controller('authenticationCtrl', function($scope, Facebook,$http) {



        $scope.login = function() {
            // From now on you can use the Facebook service just as Facebook api says
            Facebook.login(function(response) {
                // Do something with response.
                $scope.getLoginStatus();
            },{'scope':'email'});
        };

        $scope.logout= function(){
            Facebook.logout(function(response) {
                // Person is now logged out
                $scope.getLoginStatus();
                $scope.user='';
            });
        }

        $scope.getLoginStatus = function() {
            Facebook.getLoginStatus(function(response) {
                if(response.status === 'connected') {
                    $scope.loggedIn = true;
                    $scope.me();
                } else {
                    $scope.loggedIn = false;
                }
            });
        };

        $scope.me = function() {
            Facebook.api('/me', function(response) {
                $scope.user = response;
                var data = {
                    'name': $scope.user.name,
                    'email': $scope.user.email,
                    'password': 'default',
                    'fbData':{'fbUID': $scope.user.id
                    }
                };
                console.log(data);
                $http.post("", data)
                    .success(function (data, status, headers, config) {
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {

                    });
            });
        };

        $scope.$watch(function() {
            // This is for convenience, to notify if Facebook is loaded and ready to go.
            return Facebook.isReady();
        }, function(newVal) {
            // You might want to use this to disable/show/hide buttons and else
            $scope.facebookReady = true;
        });
    });

*/