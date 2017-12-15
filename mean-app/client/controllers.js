//Controller paired with /login. Uses AuthService defined in services.js
angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    //Define function login in the scope (to be called from html)
    $scope.login = function () {

      // initial values (anything within $scope can be accessed from html)
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success, redirect to homepage
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);


//Controller paired with home page
angular.module('myApp').controller('headerController',
  ['$scope', '$route', 'AuthService',
  function ($scope, $route, AuthService) {

    //Check if user is logged in
    $scope.isLoggedIn = AuthService.isLoggedIn();
    
    if($scope.isLoggedIn)
    {
    //If true, refresh service.username
    AuthService.refreshUserName()
    .then(function () {
    //After service.username has been refreshed, get it and store it in the scope
    //to be called from html
    $scope.username = AuthService.getUserName();
    });
    }
    
    //);
    
    //Function logout to be called from html
    $scope.logout = function () {

      // call logout from service and then reload the page
      AuthService.logout()
      .then(function () {
          //$location.path('/');
          $route.reload();
        });

    };

}]);



//Controller to handle user registration
angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    //Function to be called from html
    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service, with inputs from the html form
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);


angular.module('myApp').controller('eventsController',
  ['$scope', '$route', 'AuthService',
  function ($scope, $route, AuthService) {
  $(document).ready(function(){

      $(".filter-button").click(function(){
          var value = $(this).attr('data-filter');
          
          if(value == "all")
          {
              //$('.filter').removeClass('hidden');
              $('.filter').show('1000');
          }
          else
          {
  //            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
  //            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
              $(".filter").not('.'+value).hide('3000');
              $('.filter').filter('.'+value).show('3000');
              
          }
      });
      
      if ($(".filter-button").removeClass("active")) {
  $(this).removeClass("active");
  }
  $(this).addClass("active");

  });
  }]);