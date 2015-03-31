//Dirty logic should be handlled by services and directives
var myApp = angular.module("myApp",['angularFileUpload']);

myApp.controller("FileCtrl",function($scope,$upload) {
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

myApp.controller("FormCtrl",function($scope,$http){
    $scope.uploadedFile={
        url:""
    };
    $scope.submitData=function(){
        var data={
            'subject':$scope.subject,
            'message':$scope.message,
            'fileUrl':$scope.uploadedFile.url,
            'deadline':$scope.deadline,
            'hours':$scope.hours,
            'mode':$scope.mode
        };
        console.log(data);
        $http.post("/lesson/upload/",data)
            .success(function (data, status, headers, config)
            {

            })
            .error(function (data, status, headers, config) {

            });
    };

});