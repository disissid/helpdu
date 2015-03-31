//adds class on focus and removes on blur out and set the form input field,$focused as true.

var focusDirective = angular.module('focusDirective',[]);

focusDirective.directive('ngFocus',function(){
    var FOCUS_CLASS='ng-focused';
    return{
        restrict:'A',
        require:'ngModel',
        link:function(scope,element,attrs,ctrl){
            ctrl.$focused=false;
            element.bind('focus',function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function () {
                    ctrl.$focused = true;
                });

            }).bind('blur',function(evt){
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function(){
                    ctrl.$focused=false;
                });
            });
        }
    }
});
