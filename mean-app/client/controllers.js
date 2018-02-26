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

    $scope.reset=function(){
      AuthService.flagForReset($scope.loginForm.username)
    }
    
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
  ['$scope', '$route', 'AuthService', '$location',
  function ($scope, $route, AuthService, $location) {

    console.log("ROUTE IS:"+$route)
    console.log($route.current.access)
    
    if ($route.current.access.admin){
      $scope.isLoggedIn=true;
      $scope.username="Admin";
    }
    else{
      //Check if user is logged in
      $scope.isLoggedIn = AuthService.isLoggedIn();
      $scope.isProvider = AuthService.isProvider();
      
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
          if($route.current.userLocation === '/#/')     //oti pio bakalistiko exw kanei sti zwi moy #NWLIS
              $route.reload();
          else
            $location.path('/');

          $route.reload()
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
      //var Mail = new sendEmail();
      //Mail.sendEmail({from: "Heapsters Athens <heapsters@hotmail.com>", to: "m.katsaragakis@hotmail.com",subject: "Καλώς Ήρθατε στο FunActivities", text:"poutsa" });
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
  ['$scope', '$route', '$timeout', 'AuthService', '$routeParams' ,
  function ($scope, $route, $timeout, AuthService, $routeParams) {



 /* $(document).ready(function(){
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
  */

 userdata = AuthService.getUserData()
    .then(function(userdata){
      if (userdata.username == "Default Username" || userdata.location.available == false){
        $scope.userlocation = null;
      }
      else{
        console.log(userdata.location.available)
        $scope.userlocation = userdata.location;
      }
    })
  
  var markersArray = [];
  $scope.initMap = function() { 
    $scope.options = {
      zoom: 12,
      center: {lat: 37.987823, lng: 23.731857},
    }
    
    map = new google.maps.Map(document.getElementById('map'),$scope.options);
    if ($scope.userlocation != null){
      infoWindow = new google.maps.InfoWindow;
      var center = $scope.userlocation.geometry.location;
      map.setCenter(center);
      infoWindow.setContent($scope.userlocation.formatted_address);
      var marker = new google.maps.Marker({
        position: center,
        map: map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      infoWindow.open(map, marker);
    }
  }

  createMarker = function(event){

    var marker = new google.maps.Marker({
      map: map,
      position: event.location.geometry.location,
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    var contentString = '<div class = "container" id="content">'+
                          '<h2 style="color:blue;" id="firstHeading" class="firstHeading">'+event.eventname+'</h2>'+
                          '<p>'+event.description+'</p>'+
                          '<p>Πάροχος:'+ event.provider +'  ,δείτε περισσότερα <a href = "./#/singleEvent?id='+event._id+'">εδώ!</a>'+
                          '</p>'+
                        '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      //maxWidth: 400                           //we need to see what an infowindow will include
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    markersArray.push(marker);
  }
  addMarkers = function(){
    $timeout(function() {
      for (var event in $scope.eventsList) {
        //console.log(event, $scope.eventsList[event].location.geometry.location);
        createMarker($scope.eventsList[event]);
      }
    }, 800);
  }
  deleteMarkers = function() {
    $timeout(function() {
      for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }
      markersArray = [];
    }, 800);
  }

  $timeout(function() {
    $scope.initMap();
  }, 800);
  
  $scope.distances = [];
  $scope.eventsList = [];
  
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  var searchDistance = 16000;
  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function() {
    output.innerHTML = this.value;
    searchDistance = this.value*1000;
    $scope.getAllEvents();
  } 

  $scope.getAllEvents = function (){
    //$scope.eventsList = {};
    AuthService.getAllEvents($scope.nameFilter)
    .then(function (response) {
      deleteMarkers();
      if ($scope.userlocation){
        console.log('userhaslocation')
        for (var event in response){
          AuthService.calculateDistance($scope.userlocation, response[event])
            .then(function(promisedEvent){
              if (promisedEvent.distance < searchDistance){
                //console.log('found event with distance: '+ promisedEvent.distance + promisedEvent.eventname)
                $scope.eventsList.push(promisedEvent);
              }
            })
        }
        addMarkers();
        $scope.eventsList = [];
      }
      else{
        console.log('userhasNOlocation')
        $scope.eventsList = response;
        addMarkers();
      }
      console.log("i am here")
      console.log("getting events")
    }, function (error) {
      console.error(error);
    });
  };

  $scope.getAllEventsDelay = function() {
    $scope.as = AuthService.isLoggedIn();
    AuthService.getAllEvents($scope.nameFilter)
    .then(function (response) {
      deleteMarkers();
      $scope.eventsList = response;
      addMarkers();
      console.log("i am here")
      console.log("getting events")
    }, function (error) {
      console.error(error);
    });
  }

}]);

//Controller for add remove or update event
angular.module('myApp').controller('manipulateEventsController',
  ['$scope', '$route','$timeout','AuthService','$routeParams', '$location', 'sharedProperties',
  function ($scope, $route,$timeout, AuthService,$routeParams, $location, sharedProperties) {

 //Function to be called from html
 $scope.createEvent = function () {
  console.log("Creating event")
  // initial values
  $scope.error = false;
  $scope.disabled = true;
  $scope.location = sharedProperties.getProperty();

  console.log($scope.eventForm.category)
  console.log($scope.eventForm.tickets)
  userdata = AuthService.getUserData()
    .then(function(userdata){
      console.dir(userdata)
      $scope.username = userdata.username;
    })

  // call register from service, with inputs from the html form
  AuthService.createEvent($scope.eventForm.eventname,$scope.eventForm.category,$scope.eventForm.price
    ,$scope.eventForm.minage,$scope.eventForm.maxage,$scope.eventForm.tickets
    ,$scope.eventForm.description,$scope.username,$scope.location,$scope.eventForm.start_time,$scope.eventForm.end_time)
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



$scope.getPublicProviderDataByUsername = function(a) {      //what to update and the new value.
  console.log("getPublicProviderDataByUsername Controller")
  console.log(a)
  
  userdata = AuthService.getPublicProviderDataByUsername(a)
  .then(function(userdata){
    console.log('refresh user data after an update on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    $scope.companyname = userdata.companyname;
    $scope.TaxID = userdata.TaxID;
    $scope.phone = userdata.phone;
    $scope.description = userdata.description;
  })
};


  
$scope.getEventById = function (){

  $scope.isProvider = AuthService.isProvider();
  $scope.isLoggedIn = AuthService.isLoggedIn();


  console.log("GAMW TI PANAGIA")
  console.log("getting single event")
  AuthService.getSingleEvent($routeParams.id)
  .then(function (response) {
    console.log("got single event")
    $scope.event = response;
    sharedProperties.setProperty($scope.event.location);
    $scope.initMap();
    console.log("i am here")
  }, function (error) {
    console.error(error);
  })
};

$scope.getEventByIds = function (){
  console.log("getting single event")
  AuthService.getSingleEvents($routeParams.id)
  .then(function (response) {
    console.log("got single event")
    $scope.event = response;
    sharedProperties.setProperty($scope.event.location);
    $scope.initMap();
    console.log("i am here")
  }, function (error) {
    console.error(error);
  })
};

$scope.getHistory = function(){
  console.log("getting history")
  AuthService.getHistory($routeParams.id)
  .then(function(response){
    $scope.list = response;
    var ticSport=0,ticArt=0,ticScience=0,ticEnt=0;
    $scope.list.forEach(function(ev){
      //var dateTime = require('node-datetime');
      var dt = new Date();
      //var formatted = dt.getDate();
      //console.log(dt.getDate())
      //console.log(dt.getMonth())
      var year = parseInt(ev.start_time.charAt(0))*1000 + parseInt(ev.start_time.charAt(1))*100 + parseInt(ev.start_time.charAt(2))*10 + parseInt(ev.start_time.charAt(3));
      var month = parseInt(parseInt(ev.start_time.charAt(5))*10 + parseInt(ev.start_time.charAt(6)));
      //console.log(year)
      //console.log(month)
      if(dt.getFullYear()==year && dt.getMonth()+1==month){
        console.log("douleuei")
        if(ev.category==="sports"){
          ticSport= ticSport + ev.ticketspur;
        }else if(ev.category==="science"){
          ticScience= ticScience + ev.ticketspur;
        }else if(ev.category==="art"){
          ticArt= ticArt + ev.ticketspur;
        }else{
          ticEnt= ticEnt + ev.ticketspur;
        }
      }

    })

    //console.log(ticSport)
    //console.log(ticArt)
    //console.log(ticScience)
    //console.log(ticEnt)
  },function (error){
    console.error(error);
  })
};


$scope.init = function() {
  console.log("getting single event")
  AuthService.getSingleEvent($routeParams.id)
  .then(function (response) {
     $scope.event = response;
  $scope.getPublicProviderDataByUsername($scope.event.provider);
     console.log("i am here")
   }, function (error) {
     console.error(error);
   })
};

$scope.initMap = function() { 
  //$scope.options.extendedLocation = $scope.userLocation;

  // New Map
  $timeout(function() {
    //vm.pauseLoading=false;
    $scope.options = {
      zoom: 12,
      center: {lat: 37.987823, lng: 23.731857},
    }
    map = new google.maps.Map(document.getElementById('map'),$scope.options);
    var center = $scope.event.location.geometry.location;
    map.setCenter(center);

    var marker = new google.maps.Marker({
      map: map,
      position: center
    });

    var contentString = $scope.event.location.formatted_address;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }, 700);
}


$scope.buy = function(){
  console.log($scope.event.price)
  console.log($scope.notickets)
  userdata=AuthService.getUserData().then(function(userdata){
      console.log(userdata.pointsSpent)
      console.log(userdata.points)
      console.log(userdata.username)
      if((userdata.pointsSpent/100)  < Math.floor((userdata.pointsSpent+parseInt($scope.event.price)*($scope.notickets))/100)){
        console.log("mphka")
        if(parseInt($scope.event.price)*($scope.notickets)>5){
          $scope.cost=parseInt($scope.event.price)*($scope.notickets)-5;
        }else{
          $scope.cost=0;
        }

      }else{
        console.log("mphka edw")
        $scope.cost=parseInt($scope.event.price)*($scope.notickets);
      }
    });
  
  /*if($scope.cost>userdata.points){
    $scope.suf="not enough money";
  }else{
    $scope.suf="enough money";
  }*/
}

$scope.changeloc= function(){
  console.log($scope.event._id)
  var l='/buyticket'
  $location.path(l);
}



$scope.check = function(){
  userdata=AuthService.getUserData()
  .then(function(userdata){
    //console.dir(userdata)
    if($scope.cost>userdata.points){
    alert("VALE LEFTA GAMW THN PANAGIA SOU");
    }else if($scope.event.tickets<$scope.notickets){
    alert("DEN EXEI TOSA VRE VRWMIARH");  
    }else{
      AuthService.updateEventandUser(userdata.username,$scope.cost,$scope.notickets,$scope.event.eventname);
      $location.path('/#/');
    }
  })
  //$scope.test=userdata;
  //console.log($scope.test)
  //console.log(userdata.username)
}
}]);


angular.module('myApp').controller('profileController',
['$scope', '$route' ,'AuthService', 'sharedProperties',
function ($scope, $route, AuthService,sharedProperties) {

  $scope.isProvider = AuthService.isProvider();
  userdata = AuthService.getUserData()
  .then(function(userdata){
    console.log('display user data on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    $scope.location = userdata.location;
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




  
  $scope.updateProvider = function(what, value) {     //what to update and the new value.
  console.log("updateProvider Controler")
  console.log(what)
  console.log(value)
  if (what == "location"){
    value = sharedProperties.getProperty();
  }
  AuthService.updateProviderData( $scope.username, what, value)   //username is unique so there is no need to find and update by _id
  //the code below is used to refresh page data in order of an update.same as the above.^
  
  userdata = AuthService.getUserData()
  .then(function(userdata){
    console.log('refresh user data after an update on profileController')
    console.dir(userdata)
    $scope.username = userdata.username;
    $scope.firstname = userdata.firstname;
    $scope.lastname = userdata.lastname;
    $scope.email = userdata.email;
    $scope.location = userdata.location;
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
  
  
  $scope.updateParent = function(what, value) {     //same as the above for parents
    console.log("updateParent Controller")
    console.log(what)
    console.log(value)
    if (what == "location"){
      value = sharedProperties.getProperty();
    }
    AuthService.updateParentData($scope.username, what, value)    //username is unique so there is no need to find and update by _id
    
    
    //the code below is used to refresh page data in order of an update.same as the above.^
    
    userdata = AuthService.getUserData()
    .then(function(userdata){
      console.log('refresh user data after an update on profileController')
      console.dir(userdata)
      $scope.username = userdata.username;
      $scope.firstname = userdata.firstname;
      $scope.lastname = userdata.lastname;
      $scope.email = userdata.email;
      $scope.location = userdata.location;
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


angular.module('myApp')
    .service('sharedProperties', function () {
        var location = {};

        return {
            getProperty: function () {
                return location;
            },
            setProperty: function(value) {
                location = value;

            }
        };
    });

//https://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs
angular.module('myApp').controller('locationController',
  ['$scope', '$route','$timeout', 'AuthService', 'GeolocationService', 'UserLocService', 'sharedProperties',
  function ($scope, $route,$timeout, AuthService, GeolocationService, UserLocService, sharedProperties) {
    // Map options
    $scope.options = {
      zoom: 12,
      center: {lat: 37.987823, lng: 23.731857},
      extendedLocation: null
    }
    
    console.dir('myLocObject:')
    console.dir(sharedProperties.getProperty())

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
      //google.maps.event.addListener(map, 'click',
      //function(event){
      //  // Add marker
      //  addMarker({coords:event.latLng});
      //});

        //Add Marker Function(for multiple markers)
      if ($scope.options.extendedLocation != null) {
        showPosition();
        //var markers = [
        //  {
        //    coords:{lat: 37.987823, lng: 23.731857},
        //    content: '<h1 style="color:blue;">Ψάξτε τοποθεσία!</h1>'
        //  }
        //];
        //
        //// Loop through markers
        //for(var i = 0; i < markers.length; i++){
        //  // Add Marker
        //  addMarker(markers[i]);
        //}

        //function addMarker(props){
        //    var marker = new google.maps.Marker({
        //      position: props.coords,
        //      map: map
        //    });
        //
        //    //Check for custom icon
        //    if (props.iconImage){
        //      //set icon image (or anything else)
        //      marker.setIcon(props.iconImage);
        //    }
        //
        //    if (props.content){
        //
        //      var infoWindow = new google.maps.InfoWindow({
        //      //for some reason the text shows in white:p
        //      content: props.content
        //      });
        //
        //      marker.addListener('click', function(){
        //        infoWindow.open(map,marker);
        //      });
        //    }
        //  }
      }
    }; 

      $timeout(function() {
        console.debug("Showing the map. The google maps api should load now.");
        console.log("timeout");
        $scope.initMap();
        //vm.pauseLoading=false;
      }, 900);     
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
        sharedProperties.setProperty($scope.options.extendedLocation);
        var center = $scope.options.extendedLocation.geometry.location;
        map.setCenter(center);
        var marker = new google.maps.Marker({
          map: map,
          position: center
        });
    
        var contentString = $scope.options.extendedLocation.formatted_address;
    
        var infowindow = new google.maps.InfoWindow({
          content: contentString,
          //maxWidth: 400                           //we need to see what an infowindow will include
        });
    
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

      };
      
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

    $scope.button_text="Πάροχοι"
    $scope.button_funct=$scope.providers
    $scope.title_text="Γονείς"
    $scope.mode=AdminService.getMode()


    $scope.providers = function(){
    $scope.button_text="Γονείς"
    $scope.button_funct=$scope.getAllUsers
    $scope.title_text="Πάροχοι"
    $scope.mode="provider"
      AdminService.getAllProviders()
      .then(function(data){
        console.dir(data)
        $scope.page=1;
        $scope.pages=[];
        $scope.users=data.providers;
        $scope.got_users=true;
        $scope.num_users=data.providers.length;
        $scope.num_pages=Math.ceil($scope.num_users/examples_per_page);
        for(var i=1;i<$scope.num_pages+1;i++){
          $scope.pages.push(i);
        }
        $scope.pages=$scope.pages.reverse();
        $scope.setPage(1);
      })
    }

    $scope.isAdmin = function(){
      AdminService.isAdmin()
      .then(function(data){
        if (data.status){
          $scope.admin=true;
        }
        else{
          $scope.admin=false;
        }
      })
    } 

    $scope.resetPassword = function(u){
      AdminService.resetPassword(u._id);
    }

    $scope.getAllUsers = function(){
      $scope.button_text="Πάροχοι"
      $scope.button_funct=$scope.providers
      $scope.title_text="Γονείς"
      $scope.mode="parent"
      //console.log("ADMIN SERVICE IS")
      //console.dir(AdminService)
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

    $scope.deleteUser=function(u){
      console.log("U is:"+JSON.stringify(u))
      if ($scope.mode=="parent"){
      AdminService.deleteUser(u._id)
      .then(function(){
        console.log("inside then")
        $route.reload();
        console.log("User successfully deleted")
      });
      }
      else{
        AdminService.deleteProvider(u._id)
        .then(function(){
          $route.reload();
        })
      }

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
    console.log("adminservice Mode is:"+AdminService.getMode())
    if (AdminService.getMode()=="provider"){
      $scope.providers();
    }
    else{
    $scope.getAllUsers();
  }
}
  init();
}])


angular.module('myApp').controller('resetController',
  ['$scope', '$route','$routeParams','$location' ,'AuthService',
  function ($scope, $route,$routeParams,$location, AuthService) {

    $scope.reset=function(){
      console.log("CTRL:running reset")
      $scope.uID=$routeParams.uID
      $scope.newPass=$scope.resetForm.password
      AuthService.setPassword($scope.uID,$scope.newPass)
      .then(function(){
        $location.path('/login')
      })
    }
    
  }]);