var loginApp = angular.module("loginApp",[]);

loginApp.controller("LoginController",function($scope,$http,$window,$location){
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
                    alert(data.message);
                }
            })
            .error(function (data, status, headers, config) {

            });
        $scope.user.email='';
        $scope.user.password='';

    };
});
