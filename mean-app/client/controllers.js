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
  ['$scope', '$route','AuthService','$routeParams', '$location', 
  function ($scope, $route, AuthService,$routeParams, $location) {

 //Function to be called from html
 $scope.createEvent = function () {
  console.log("Creating event")
  // initial values
  $scope.error = false;
  $scope.disabled = true;

  // call register from service, with inputs from the html form
  AuthService.createEvent($scope.eventForm.eventname,$scope.eventForm.category,$scope.eventForm.price
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
  
  
}

$scope.getEventById = function (){
  console.log("getting single event")
  AuthService.getSingleEvent($routeParams.id)
  .then(function (response) {
    $scope.event = response;
    console.log("i am here")
  }, function (error) {
    console.error(error);
  })
};

}]);



angular.module('myApp').controller('profileController',
['$scope', '$route' ,'AuthService',
function ($scope, $route, AuthService) {

  $scope.isProvider = AuthService.isProvider();
  userdata = AuthService.getUserData()
  .then(function(userdata){
    console.log('display user data on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    if($scope.isProvider){  
      $scope.companyname = userdata.companyname;
      $scope.TaxID = userdata.TaxID;
      $scope.phone = userdata.phone;
	  $scope.description = userdata.description;
    }
    else{
      $scope.mobile = userdata.mobile;
      $scope.points = userdata.points;
    }
  })
	
  $scope.updateProvider = function(what, value) {			//what to update and the new value.
	console.log("updateProvider Controler")
	console.log(what)
	console.log(value)
	AuthService.updateProviderData( $scope.username, what, value)		//username is unique so there is no need to find and update by _id
	//the code below is used to refresh page data in order of an update.same as the above.^
	
	userdata = AuthService.getUserData()
	.then(function(userdata){
    console.log('refresh user data after an update on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    if($scope.isProvider){  
      $scope.companyname = userdata.companyname;
      $scope.TaxID = userdata.TaxID;
      $scope.phone = userdata.phone;
	  $scope.description = userdata.description;
    }
    else{
      $scope.mobile = userdata.mobile;
      $scope.points = userdata.points;
    }
  })
  }
  
  
  $scope.updateParent = function(what, value) {			//same as the above for parents
	console.log("updateProvider Controler")
	console.log(what)
	console.log(value)
	AuthService.updateParentData( $scope.username, what, value)		//username is unique so there is no need to find and update by _id
	
	
	//the code below is used to refresh page data in order of an update.same as the above.^
	
	userdata = AuthService.getUserData()
	.then(function(userdata){
    console.log('refresh user data after an update on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    if($scope.isProvider){  
      $scope.companyname = userdata.companyname;
      $scope.TaxID = userdata.TaxID;
      $scope.phone = userdata.phone;
	  $scope.description = userdata.description;
    }
    else{
      $scope.mobile = userdata.mobile;
      $scope.points = userdata.points;
    }
  })
  }
  
}
]);

//https://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs
angular.module('myApp').controller('eventsLocationController',
  ['$scope', '$route','$timeout', 'AuthService', 'GeolocationService', 'UserLocService',
  function ($scope, $route,$timeout, AuthService, GeolocationService, UserLocService) {
    // Map options
    $scope.options = {
      zoom: 12,
      center: {lat: 37.987823, lng: 23.731857},
      extendedLocation: null
    }

    $timeout(function(){
      AuthService.refreshUserLocation()
      .then(function () {
      //After service.username has been refreshed, get it and store it in the scope
      //to be called from html
      $scope.userLocation = AuthService.getUserLocation();
      $scope.options.extendedLocation = $scope.userLocation;
      });
    },200);

    //$scope.map;
    $scope.initMap = function() {
  
      //$scope.options.extendedLocation = $scope.userLocation;

      // New Map
      map = new google.maps.Map(document.getElementById('map'),$scope.options);
      infoWindow = new google.maps.InfoWindow;

      // Listen for click on map
      google.maps.event.addListener(map, 'click',
      function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

        //Add Marker Function(for multiple markers)
      if ($scope.options.extendedLocation == null) {
        var markers = [
          {
            coords:{lat: 37.987823, lng: 23.731857},
            content: '<h1 style="color:blue;">Ψάξτε τοποθεσία!</h1>'
          }
        ];

        // Loop through markers
        for(var i = 0; i < markers.length; i++){
          // Add Marker
          addMarker(markers[i]);
        }

      function addMarker(props){
          var marker = new google.maps.Marker({
            position: props.coords,
            map: map
          });

          //Check for custom icon
          if (props.iconImage){
            //set icon image (or anything else)
            marker.setIcon(props.iconImage);
          }

          if (props.content){

            var infoWindow = new google.maps.InfoWindow({
            //for some reason the text shows in white:p
            content: props.content
            });

            marker.addListener('click', function(){
              infoWindow.open(map,marker);
            });
          }
        }
      }
      else {
        showPosition();
      }
    }; 

      $timeout(function() {
        console.debug("Showing the map. The google maps api should load now.");
        console.log("timeout");
        $scope.initMap();
        //vm.pauseLoading=false;
      }, 700);     
      $scope.captureUserLocation = function() {

        if (navigator.geolocation) {
          //find the current position (lat,lng) using geolocation
          navigator.geolocation.getCurrentPosition(function(position) {
            //if succesfull then use reverse geocoding to find extended user location
            var infowindow = new google.maps.InfoWindow;
            var geocoder = new google.maps.Geocoder();
            var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            geocoder.geocode({'location':userLatLng}, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  $scope.options.extendedLocation = results[0];
                  showPosition();
                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition($scope.options.center);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }  

      $scope.findLocation = function() {
        var address = $scope.address;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {'address': address, 
            componentRestrictions: {locality: 'Athens', country: 'Greece'}    //rules about locality will not be enforced! see: https://developers.google.com/maps/documentation/geocoding/intro#Viewports
          },
      function(results, status) {
          if (status === 'OK') {
            $scope.options.extendedLocation = results[0];
            showPosition();
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      };

      function showPosition() {
        var center = $scope.options.extendedLocation.geometry.location;
        map.setCenter(center);
        infoWindow.setPosition(center);
        //for marker checkk google api 's (reverse geocoding etc... beautify)
        //var contentString = '<div id="content">'+
        //                      '<div id="siteNotice">'+
        //                      '</div>'+
        //                      '<h2 style="color:blue;" id="firstHeading" class="firstHeading">Location Found!</h2>'+
        //                    '</div>';
        infoWindow.setContent('Η τοποθεσία μου:'+ $scope.options.extendedLocation.formatted_address);
        infoWindow.open(map);
        //for(var i = 0; i < markers.length; i++){
          // Add Marker
        //marker.setMap(null);
        //}
        //markers = [];
      };

      //function showPosition(position) {
      //  $scope.options = {
      //    zoom: 16,
      //    center: {lat: position.coords.latitude, lng: position.coords.longitude},
      //    extendedLocation: position
      //  }   
      //  console.log(position);
      //  map.setCenter($scope.options.center);
      //  infoWindow.setPosition($scope.options.center);
      //  infoWindow.setContent('Location found.'+position.formatted_address);
      //  infoWindow.open(map);
      //};
      
      
      $scope.saveLocation = function() {
        //map.setCenter({lat: 12.32, lng:12.33});
        UserLocService.update($scope.options.extendedLocation).
        then(function () {
          console.log("CHANGING PATH")
        })
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
      };      
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