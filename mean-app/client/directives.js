app=angular.module('myApp');

app.directive("headerNavDirective", function() {
    return {
        templateUrl: "./partials/components/navbar.html",
        controller:"headerController"
    };
});

app.directive("footerDirective",function(){
	return{
		templateUrl:"./partials/components/footer.html"
	}
})

