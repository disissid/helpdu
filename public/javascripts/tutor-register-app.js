var tutorRegisterApp = angular.module("registerApp",['focusDirective']);


/*tutorRegisterApp.config(function(FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('693880737394303');
})

    .controller('authenticationCtrl', function($scope, Facebook,$http,$window) {

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
                $http.post("/tutorRegister", data)
                    .success(function (data, status, headers, config) {
                        console.log(data);
                        $window.location.href =data.message;
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



