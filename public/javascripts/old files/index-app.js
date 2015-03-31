var indexApp = angular.module("indexApp",[]);

indexApp.controller("LoginController",function($scope,$http,$window){
    $scope.submitData=function(){
        var data={
            'email':$scope.user.email,
            'password':$scope.user.password
        };

        console.log(data);
        $http({
            method: 'POST',
            url:'',
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
                console.log(config);
            })
            .error(function (data, status, headers, config) {
            });
        $scope.user.email='';
        $scope.user.password='';
        $window.location.href=$window.location.href+'/../student/ishan';

    }
});
