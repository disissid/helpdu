var testApp = angular.module('testApp',['angularFileUpload','services']);

testApp.controller("TestController",function($scope,$http){

    $scope.submitData=function(data){
        var data={
            'dataQuery':data,
            'subject':$scope.subject,
            'lessonId':$scope.lessonId
        };
        console.log(data);
        $http.post("/profile/getProfileData",data)
            .success(function (data, status, headers, config)
            {
                $scope.response=data;
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };

});

testApp.controller("FileCtrl",function($scope,$upload) {
    $scope.onFileSelect = function($files) {
        $scope.uploadedFile.fileUploaded = false;
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: '/upload/',
                headers: {'Content-Type': 'multipart/form-data'},
                file: $file,
                progress: function(e){}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ');
            }).then(function(data, status, headers, config) {
                $scope.uploadedFile.url=data;
                console.log(data);
                $scope.uploadedFile.fileUploaded = true;
            });
        }};
});

testApp.controller("RequestLessonCtrl",function($scope,$http){
    $scope.uploadedFile={
        'url':"",
        'fileUploaded':'true'
    };
    $scope.submitData=function(){
        var data={
            'dataQuery':'submitLesson',
            'subject':$scope.subject,
            'message':$scope.message,
            'fileUrl':$scope.uploadedFile.url,
            'deadline':$scope.deadline,
            'hours':$scope.hours,
            'mode':$scope.mode
        };
        console.log(data);
        $http.post("/profile/getProfileData",data)
            .success(function (data, status, headers, config)
            {
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });
    };

});


testApp.controller("UpdateController",function($scope,updatingService,$interval){

    $scope.submitData=function(){
        console.log("hello");
        var abc=updatingService.updateDivision("123");
        if(abc){
            $scope.dumpData=abc;
            abc='';
            console.log("recursive called");
            $scope.submitData();
        }
    }

    $interval($scope.submitData, 2000);



});