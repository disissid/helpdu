//check if anyone loggedIn or not

var services= angular.module('services',[]);


services.factory('loggedIn',function(){
        return {
            anyoneLoggedIn: function () {
                return true;                                   //check if anyone loggedIn or not
            },
            whoLoggedIn: function () {
                return 0;
            },
            getOnlineTutorList:function(){
                return [{name:'vijay'},
                    {name:'ankit'}];
            }
            /*$http.get("")
			.success(function (data, status, headers, config) {
					return
			})
			.error(function (data, status, headers, config) {
			});
}*/
}
});





services.factory('toggleVisibility', function($scope,$window) {

        $scope.menuOpened = false;

        $scope.toggleMenu = function(event) {
            $scope.menuOpened = !($scope.menuOpened);

            // Important part in the implementation
            // Stopping event propagation means window.onclick won't get called when someone clicks
            // on the menu div. Without this, menu will be hidden immediately
            event.stopPropagation();
        };

        $window.onclick = function() {
            if ($scope.menuOpened) {
                $scope.menuOpened = false;
                // You should let angular know about the update that you have made, so that it can refresh the UI
                $scope.$apply();
            }
        };

    }
);


services.factory('updatingService',function($http){
    return {
       updateDivision:function(url){
           $http.get(url)
               .success(function (data, status, headers, config) {
                   return data;
               })
               .error(function (data, status, headers, config) {
                   return data;
               });

       }

    };
});
