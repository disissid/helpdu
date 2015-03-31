var errorApp = angular.module('errorApp',[]);

errorApp.controller("ErrorCtrl",function($scope,$http){
    $http.get("/errorPage")
        .success(function (data, status, headers, config)
        {   $scope.error=data;
            console.log(data);
        })
        .error(function (data, status, headers, config) {

        });

});