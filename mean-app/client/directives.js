app=angular.module('myApp');

app.directive("headerNavDirective", function() {
    return {
    	controller:"headerController",
        templateUrl: "./partials/components/navbar.html"
    };
});

app.directive("footerDirective",function(){
	return{
		templateUrl:"./partials/components/footer.html"
	}
})


//Calls function when user starts typing
//https://stackoverflow.com/questions/21891229/search-box-in-angular-js
app.directive('onKeyDownCall', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {            
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
        });
    };
});

