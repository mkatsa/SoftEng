var myApp = angular.module('myApp', ['ngRoute']);


//Configure clienet side routing. If restricted = true, only available to logged in users
//For each route there is a controller in controllers.js
myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      //controller: 'homeController',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/events',{
      templateUrl:'partials/events.html',
      controller:'eventsController',
      access:{restricted:false}
    })
    .when('/events-location',{
      templateUrl:'partials/events-location.html',
      controller:'eventsLocationController',
      access:{restricted:true}
    })
    .when('/terms',{
      templateUrl:'partials/terms.html',
      access:{restricted:false}
    })
    .when('/about',{
      templateUrl:'partials/about.html',
      accss:{restricted:false}
    })
    .when('/contact',{
      templateUrl:'partials/contact.html',
      accss:{restricted:false}
    })
    .when('/faq',{
      templateUrl:'partials/faq.html',
      accss:{restricted:false}
    })
    .when('/donate',{
      templateUrl:'partials/donate.html',
      accss:{restricted:false}
    })
    .otherwise({
      redirectTo: '/',
      access:{restricted:false}
    });
    
});


//When changing route, check if next page is restricted and if user is logged in
//If not, redirect them to /login
myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {


      AuthService.getUserStatus()
      .then(function(){
        if (next.access != undefined && next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });

  });
});






