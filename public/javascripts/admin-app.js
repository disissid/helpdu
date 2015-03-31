var adminApp = angular.module('adminApp',[]);

adminApp.controller('MainCtrl',function($scope,$http,$window,$parse){
    $scope.getAdminData=function(){
        $scope.Authenticated=false;
        var data={
            'dataQuery':'subjectList'
        };
        console.log(data);
        $http.post("/admin/getAdminData",data)
            .success(function (data, status, headers, config)
            {
                if(data.code!='1') {
                    $window.location.href = '/login';
                }else{
                console.log(data);$scope.subjects=data.dumpData;
                $scope.Authenticated=true;
            }
            })
            .error(function (data, status, headers, config) {

            });
    }
});

adminApp.controller('HeaderCtrl',function($scope,$http,$window){
    $scope.submitData=function(){
        var data={
            'dataQuery':'subjectList'
        };
        console.log(data);
        $http.post("/admin/getAdminData",data)
            .success(function (data, status, headers, config)
            {   console.log(data);
                $window.location.href ='/login';
            })
            .error(function (data, status, headers, config) {

            });
    };
});

adminApp.controller('AdminLoginCtrl',function($scope,$http,$window){
    $scope.submitData=function(){
        var data={
            'email':$scope.email,
            'password':$scope.password
        };
        console.log(data);
        $http.post("/adminLocalLogin",data)
            .success(function (data, status, headers, config)
            {   console.log(data);
                if(data.code=='0') {
                    $window.location.href = data.message;
                }
            })
            .error(function (data, status, headers, config) {

            });
    };
});

adminApp.controller('SubjectListCtrl', function ($scope,$http) {

    $scope.removeSubject=function(index) {
        var data={
            'dataQuery':$scope.subjects[index].subjectName
        }
        console.log(data);


        $http.post("/admin/removeSubject",data)
            .success(function (data, status, headers, config)
            {
                console.log(data);
            })
            .error(function (data, status, headers, config) {

            });

        $scope.subjects.splice(index, 1);
    }

    $scope.submitData=function(){
        var data={
            'dataQuery':$scope.subjectName
        };
        console.log(data);
        $http.post("/admin/addSubject",data)
            .success(function (data, status, headers, config)
            {
                console.log(data);
                $scope.subjects.push({subjectName:$scope.subjectName});

            })
            .error(function (data, status, headers, config) {

            });

    };
});