/////////////////////////////////////////////////////////////////////////////
//Store current page here if next page is login (to redirect them)
angular.module('myApp').value('RedirectToUrlAfterLogin', { url: '/' });

/////////////////////////////////////////////////////////////////////////////
//Service handling authorization
angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // create user variable
    if(!isLoggedIn()){
      var user = null; //User is true if any type of user is logged in
      var provider=false; //Provider is true if provider is logged in
      var username="anonymous";
      var userLocation = {};
    }

    //Returns true if user is logged in
    function isLoggedIn(){
      if(user) {
        return true;
      } 
      else {
        return false;
      }
    }

    function isProvider(){
      if(provider){
        return true;
      }
      else{
        return false
      }
    }

    //Logs out the user
    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
      // handle success
      .success(function (data) {
        user = false;
        provider=false;
        deferred.resolve();
      })
      // handle error
      .error(function (data) {
        user = false;
        provider=false;
        deferred.reject();
      });

      // return promise object
      return deferred.promise;

    }

    //Log in
    //First check if user login
    //If it fails check if provider login
    //If it fails, login fails
    function login(username, password) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.status){
          user = true;          
          deferred.resolve();
        } 
      })
      // handle error
      .error(function (data) {
        console.log("auth_service:login.error")
        $http.post('/provider/login',
          {username:username,password:password})
        .success(function(data,status){
          console.log("auth_service:login.error.success")
          if(status==200&&data.status){
            console.log("auth_service:login.error.success IF")
            user=true;
            provider=true;
            deferred.resolve();
          }
          else{
            console.log("auth_service:login.error.success ELSE")
            user = false;
            provider=false;
            deferred.reject();
          }
        })
        .error(function(data){
          console.log("auth_service:login.error.error")
          user = false;
          provider=false;
          deferred.reject();
        })
      });

    // return promise object
    return deferred.promise;

  }


    //Gets the user's username from backend
    //(Does not return)
    function refreshUserName(){

      var deferred = $q.defer();
      if (!provider){
        console.log("provider bool is false")
        req=$http.get('/user/userName');
      }
      else{
        console.log("provider bool is true")
        req=$http.get('/provider/userName')
      }
      // send a post request to the server
      //$http.get('/user/userName')
      // handle success
      req
      .success(function (data,status) {
        if(status === 200 && data.username){
          console.log('SERVICE: Success!')
          username=data.username
          deferred.resolve();
        } else {
          console.log('SERVICE: else')
          console.log('SERVICE: status:'+status)
          console.log('SERVICE: data:'+data)
          deferred.reject();
        }
      })
    // handle error
    .error(function (data) {
      console.log('SERVICE: error')
      deferred.reject();
    });

    // return promise object
    return deferred.promise;
  }

  //Returns user's username  
  function getUserName(){
      return username;
  } 


  function refreshUserLocation(){
      
    var deferred = $q.defer();

    // send a post request to the server
    $http.get('/user/userLocation')
    // handle success
    .success(function (data,status) {
    if(status === 200 && data.userLocation){
      console.log('SERVICE: Success!')
      userLocation=data.userLocation;
      deferred.resolve();
    } else {
      console.log('SERVICE: else')
      console.log('SERVICE: status:'+status)
      console.log('SERVICE: data:'+data)
      deferred.reject();
    }
  })
  // handle error
    .error(function (data) {
    console.log('SERVICE: error')
    deferred.reject();
  });

  // return promise object
  return deferred.promise;
}

  //Returns users's location
  function getUserLocation(){
      console.log('asked for user location')
      return userLocation;
    } 




  //Returns all data of a user or a provider
  function getUserData(){

    var deferred = $q.defer();
      if (!provider){                 //check if he is provider or parent
        console.log("provider bool is false")
        req=$http.get('/user/get_all');
      }
      else{
        console.log("provider bool is true")
        req=$http.get('/provider/get_all')
      }

      req
      .success(function (data,status) {
        if(status === 200 && data.username){
          console.log('SERVICE: Success!')
          console.dir(data)
          deferred.resolve(data);
        } else {
          console.log('SERVICE: else')
          console.log('SERVICE: status:'+status)
          console.log('SERVICE: data:'+data)
          deferred.reject();
        }
      })
    // handle error
    .error(function (data) {
      console.log('SERVICE: error')
      deferred.reject();
    });

    // return promise object
    return deferred.promise;
  }





    //Gets user's status from backend
    //(does not return)
    function getUserStatus() {
      var deferred = $q.defer();

      console.log('SERVICE: getting userStatus')
      $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          //console.log('SERVICE: Success if')
          user = true;
		  if( data.isProvider === true )
			  provider = true;
          deferred.resolve();

        } else {
          //console.log('SERVICE: Success else')
          user = false;
          deferred.resolve();

        }
      })
      // handle error
      .error(function (data) {
        //console.log('SERVICE: error')
        user = false;
        deferred.reject();

      });
      return deferred.promise;
    }


    function register(username, password,firstname,lastname,email) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, password: password,firstname:firstname,lastname:lastname,email:email})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        console.log(data)
        deferred.reject();
      });

  // return promise object
  return deferred.promise;
}


function register_provider(username, password, firstname, lastname, email, companyname, TaxID) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/provider/register_provider',
        {username:username, password:password, firstname:firstname, lastname:lastname, email:email, companyname:companyname,TaxID:TaxID})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.status){
          console.log("rp:success(200)")
          provider= true;
          deferred.resolve();
        } else {
          console.log("rp.sucess(else)")
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        console.log("rp.error")
        console.log(data)
        deferred.reject();
      });

  // return promise object
  return deferred.promise;
}
function createEvent(eventname,category, price, minage, maxage, tickets, description, provider, location){
  var deferred = $q.defer();
  console.log("here1")
  console.log(eventname)
  console.log(price)
  console.log(minage)
  console.log(maxage)
  console.log(description)
  console.log(category)
  console.log(provider)
  console.log(location)
  $http.post('/event/createEvent',
    {eventname:eventname,category: category, price:price, minage:minage, maxage:maxage, description:description,provider:provider,location:location,tickets:tickets})
  .success(function (status) {
    console.log("yolo")
    console.log(tickets)
    console.log("createEvent:success(200)")
    deferred.resolve();
  })
  .error( function () {
    console.log("createEvent.error")
    deferred.reject();
  });
  return deferred.promise;
}



function getAllEvents(qu) {
  var deferred = $q.defer(),
  httpPromise = $http.get('event/findEvents/'+qu);

  httpPromise.success(function (response) {
    deferred.resolve(response);
  })
  .error(function (error) {
    console.error(error);
  }); 
  return deferred.promise;
}

function getSingleEvent(id) {
  var deferred = $q.defer(),
  httpPromise = $http.get('event/singleEvent/'+id);

  httpPromise.success(function (response) {
    deferred.resolve(response);
  })
  .error(function (error) {
    console.error(error);
  }); 
  return deferred.promise;
}



//this service is about updating a provider's data
//username is the username of the provider we want to update
//what is the field we want to cheng and the value has the new value to be put in mongo
function updateProviderData(username, what, value) {
	console.log( "I am on updateProviderData service")
	console.log(username)
	console.log(what)
	console.log(value)
	var deferred = $q.defer(),
	httpPromise = $http.put('/provider/update_provider',
        {username: username,what: what, value: value})
      // handle success
      .success(function () {
          deferred.resolve();
	  })
        
	  return deferred.promise;
}


//this service is about updating a parent's data
//username is the username of the provider we want to update
//what is the field we want to cheng and the value has the new value to be put in mongo
function updateParentData(username, what, value) {
	console.log( "I am on updateProviderData service")
	console.log(username)
	console.log(what)
	console.log(value)
	var deferred = $q.defer(),
	httpPromise = $http.put('/user/update_parent',
        {username: username,what: what, value: value})
      // handle success
      .success(function () {
          deferred.resolve();
	  })
	  return deferred.promise;
}


function updateEventandUser(username,cost,notickets,eventname){
  console.log(username)
  console.log(cost)
  console.log(notickets)
  console.log(eventname)
  var deferred=$q.defer();
    httpPromise = $http.post('/user/eventbought',
    {username:username,cost:cost,eventname:eventname})
  .success(function(){
    deferred.resolve();
  })
  httpPromise = $http.post('/event/updateTickets',
    {eventname:eventname,notickets:notickets}).
  success(function(){
    deferred.resolve();
  })
  //deferred.resolve();
  return deferred.promise;
}


function getPublicProviderDataByUsername(uname){
	console.log('Public Provider Data Service')
	console.log(uname)
    var deferred = $q.defer();
    req=$http.get('/provider/get_all_by_username/'+uname)
    

    req
    .success(function (data,status) {
        if(status === 200){
          console.log('SERVICE: Success!')
          console.dir(data)
          deferred.resolve(data);
        } else {
          console.log('SERVICE: else')
          console.log('SERVICE: status:'+status)
          console.log('SERVICE: data:'+data)
          deferred.resolve(data);
        }
      })
    // handle error
    .error(function (data) {
      console.log('SERVICE: error')
      deferred.reject();
    });

    // return promise object
    return deferred.promise;
  }



  
  
 //username=getUserName();

 return ({
  isLoggedIn: isLoggedIn,
  getUserStatus: getUserStatus,
  getUserName: getUserName,
  refreshUserName: refreshUserName,
  getUserLocation: getUserLocation,
  refreshUserLocation: refreshUserLocation,
  login: login,
  logout: logout,
  register: register,
  register_provider: register_provider,
  getUserData: getUserData,
  isProvider: isProvider,
  createEvent: createEvent,
  getAllEvents: getAllEvents,
  updateProviderData: updateProviderData,
  updateParentData: updateParentData,
  getSingleEvent: getSingleEvent,
  getPublicProviderDataByUsername: getPublicProviderDataByUsername,
  updateEventandUser:updateEventandUser
});
}]);



/////////////////////////////////////////////////////////////////////////////////////////////////////
//Service handling geolocation
//https://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs

angular.module('myApp').factory('GeolocationService', ['$q', '$window', function ($q, $window) {

  'use strict';

  function getCurrentPosition() {
    var deferred = $q.defer();
    if (!$window.navigator.geolocation) {
      deferred.reject('Geolocation not supported.');
    } else {
      $window.navigator.geolocation.getCurrentPosition(
        function (position) {
          deferred.resolve(position);
        },
        function (err) {
          deferred.reject(err);
        });
    }

    return deferred.promise;
  }

  return {
    getCurrentPosition: getCurrentPosition
  };
}]);

// Service Handling User Location Update
  angular.module('myApp').factory('UserLocService',['$q','$http',
    function($q,$http){

      function update(location){
        var deferred = $q.defer();
      console.log('123');
      $http.post('/user/locationUpdate',{location:location}).success(function () {  
        console.log('456')        
        deferred.resolve();
        
      });
      return deferred.promise;
    }
    
    return{
      update:update
    };
}]);


///////////////////////////////////////////////////////////////////////////////
//Service handling ADMIN api requests
angular.module('myApp').factory('AdminService',['$q','$http',
  function($q,$http){

    function getAllUsers(){
      console.log("GETTING USERS")
      var deferred=$q.defer();
      $http.get('/admin/all_users')
      .success(function(data){
        deferred.resolve(data);
      })
      .error(function(err){
        deferred.reject(err)
      });
      return deferred.promise;
    }

    return{
      getAllUsers:getAllUsers
    };
  }]);


  

  angular.module('myApp').factory('TransferService',['$q','$http',
    function($q,$http){

      function transfer(amount){
        var deferred = $q.defer();
      //console.log(amount)
      $http.post('/user/transfer',{amount:amount}).success(function () {          
        deferred.resolve();
      });
      return deferred.promise;
    }

    return{
      transfer:transfer
    };
  }]);