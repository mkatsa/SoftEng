//Controller paired with /login. Uses AuthService defined in services.js
angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService','RedirectToUrlAfterLogin',
  function ($scope, $location, AuthService,RedirectToUrlAfterLogin) {


    //If user is already logged in, redirect them where the were
    AuthService.getUserStatus().then(function(){
      if (AuthService.isLoggedIn()){
        console.log("you are already logged in, redirecting to:"+RedirectToUrlAfterLogin.url);
        $location.path(RedirectToUrlAfterLogin.url);
      }
    })
    
    //Define function login in the scope (to be called from html)
    $scope.login = function () {


      // initial values (anything within $scope can be accessed from html)
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success, redirect to homepage
        .then(function () {
          $location.path(RedirectToUrlAfterLogin.url);
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Λάθος όνομα χρήστη ή/και κωδικός";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

      };

    }]);

//Controller for home page

angular.module('myApp').controller('homeController',
  ['$scope', '$route' ,'AuthService',
  function ($scope, $route, AuthService) {

    $scope.isProvider = AuthService.isProvider();
    
  }]);



//Controller paired with home page
angular.module('myApp').controller('headerController',
  ['$scope', '$route', 'AuthService',
  function ($scope, $route, AuthService) {

    console.log("ROUTE IS:"+$route)
    console.log($route.current.access)
    
    if ($route.current.access.admin){
      $scope.isLoggedIn=true;
      $scope.username="Admin";
    }
    else{
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
      console.log("REGISTERING")
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service, with inputs from the html form
      AuthService.register($scope.registerForm.username, $scope.registerForm.password
        ,$scope.registerForm.firstname,$scope.registerForm.lastname
        ,$scope.registerForm.email)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          console.log("CHANGING PATH")
          $location.path('/');

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

//Controller to handle provider registration
angular.module('myApp').controller('registerProviderController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {


    //Function to be called from html
    $scope.register_provider = function () {
      console.log("REGISTERING PROVIDER")
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service, with inputs from the html form
      AuthService.register_provider($scope.registerForm.username, $scope.registerForm.password
        ,$scope.registerForm.firstname,$scope.registerForm.lastname
        ,$scope.registerForm.email,$scope.registerForm.companyname
        ,$scope.registerForm.TaxID)
        // handle success
        .then(function () {
          console.log("controller:RP:THEN")
          $scope.disabled = false;
          $scope.registerForm = {};
          console.log("CHANGING PATH")
          $location.path('/');

        })
        // handle error
        .catch(function () {
          console.log("controller:RP:catch")
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

      };

      var init=function(){
        if (AuthService.isLoggedIn() && AuthService.isProvider()){
          $location.path('/welcome_provider');
        }
      };
      init()
    }]);


angular.module('myApp').controller('eventsController',
  ['$scope', '$route', 'AuthService',
  function ($scope, $route, AuthService) {
 /* $(document).ready(function(){
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
  */
  $scope.eventsList = {};
  AuthService.getAllEvents()
  .then(function (response) {
    $scope.eventsList = response;
    console.log("i am here")
  }, function (error) {
    console.error(error);
  });
  
}]);

//Controller for add remove or update event
angular.module('myApp').controller('manipulateEventsController',
['$scope', '$route','AuthService', '$location', 
function ($scope, $route, AuthService, $location) {

 //Function to be called from html
 $scope.createEvent = function () {
  console.log("Creating event")
  // initial values
  $scope.error = false;
  $scope.disabled = true;

  // call register from service, with inputs from the html form
  AuthService.createEvent($scope.eventForm.eventname, $scope.eventForm.price
  ,$scope.eventForm.minage,$scope.eventForm.maxage
  ,$scope.eventForm.description)
  // handle success
  .then(function () {
    console.log("controller:events controller:THEN")
    $scope.disabled = false;
    $scope.eventForm = {};
    console.log("CHANGING PATH")
    $location.path('/');

  })
  // handle error
  .catch(function () {
    console.log("controller:events controller:catch")
    $scope.error = true;
    $scope.errorMessage = "Something went wrong!";
    $scope.disabled = false;
    $scope.registerForm = {};
  });
};
}]);



angular.module('myApp').controller('profileController',
['$scope', '$route' ,'AuthService',
function ($scope, $route, AuthService) {

  $scope.isProvider = AuthService.isProvider();
  userdata = AuthService.getUserData()
  .then(function(userdata){
    console.log('adsdas')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    if($scope.isProvider){  
      $scope.companyname = userdata.companyname;
      $scope.TaxID = userdata.TaxID;
      $scope.phone = userdata.phone;
    }
    else{
      $scope.mobile = userdata.mobile;
      $scope.points = userdata.points;
    }
  })
}]);



//https://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs
angular.module('myApp').controller('eventsLocationController',
['$scope', '$route', 'AuthService', 'GeolocationService',
function ($scope, $route, AuthService,GeolocationService) {

  var haveLoc=false;    
  $scope.captureUserLocation = function() {
    if (!haveLoc){
      GeolocationService.getCurrentPosition()
      .then(function(position){
        haveLoc=true;
        console.log("KOBLE");
        showPosition(position);
      });
    }
  }

  function showPosition(position) {
    latlon = position.coords.latitude + "," + position.coords.longitude;

    //API key AIzaSyBpyJPBHwTbkAFdT8BBlc3p1i8OxMLR7pw

    img_url = "https://www.google.com/maps/embed/v1/view?key=AIzaSyBEe0-lSLxmJnc_X48luijRr17_yWrBAtA&zoom=14&center="+latlon;
    document.getElementById("mapholder").innerHTML = "<iframe src='"+img_url+"'></iframe>";
  }
}]);

angular.module('myApp').controller('transferController',
['$scope', 'TransferService',
function ($scope, TransferService) {
  //$scope.amount="12";
  //console.log("pousth")
  //$scope.disabled = false;
  $scope.transfer = function(){
    //console.log($scope.amount);
    TransferService.transfer($scope.amount,);
    //$scope.disabled = true;
    $scope.amount="";
    $scope.cardId="";
    $scope.cardHolder="";
    $scope.CCV="";
  }
}
]);


angular.module('myApp').controller('adminController',['$scope','$route','AdminService',
function($scope,$route,AdminService){
  $scope.got_users=false;

  var examples_per_page=10;


  $scope.getAllUsers = function(){
    AdminService.getAllUsers()
    .then(function(data){
      $scope.page=1;
      $scope.pages=[];
      $scope.users=data.users;
      console.log("USERS:")
      console.log(data.users)
      $scope.got_users=true;
      $scope.num_users=data.users.length;
      $scope.num_pages=Math.ceil($scope.num_users/examples_per_page);
      for(var i=1;i<$scope.num_pages+1;i++) {
        $scope.pages.push(i);
      }
      $scope.pages=$scope.pages.reverse();
      $scope.setPage(1)        
    })
  }

  $scope.setPage=function(pagenum){
    $scope.page=pagenum;
    //Index of first user of the page
    start=($scope.page-1)*examples_per_page;
    if ($scope.page<$scope.num_pages){
      end = ($scope.page)*examples_per_page;
    }
    else{
      end=$scope.users.length;
    }
    $scope.pageusers=$scope.users.slice(start,end);
  }



  var init=function(){
    $scope.getAllUsers();
  }
  init();
}])