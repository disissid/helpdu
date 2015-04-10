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


services.service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID)+190-document.documentElement.clientHeight/2;
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 50);
        if (speed >= 30) speed = 30;
        console.log("speed="+speed);
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

});
