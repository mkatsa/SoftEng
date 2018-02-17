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
      var provider=false; //Proveder is true if provider is logged in
      var username="anonymous";
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




	//Returns all data of a user or a provider
	function getUserData(){
      
      var deferred = $q.defer();
      if (!provider){									//check if he is provider or parent
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

      //console.log('SERVICE: getting userStatus')
      $http.get('/user/status')
      // handle success
        .success(function (data) {
        if(data.status){
          //console.log('SERVICE: Success if')
          user = true;
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




//username=getUserName();

return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      getUserName: getUserName,
      refreshUserName: refreshUserName,
      login: login,
      logout: logout,
      register: register,
	  register_provider: register_provider,
	  getUserData: getUserData,
	  isProvider: isProvider
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
  
  angular.module('myApp')
  .factory('EventsParsing', function ($q, $http) {
    return {
      getAllEvents: function () {
        var deferred = $q.defer(),
          httpPromise = $http.get('events/findEvents');
 
        httpPromise.success(function (response) {
          deferred.resolve(response);
        })
        .error(function (error) {
          console.error(error);
        });
 
        return deferred.promise;
      }
    };
  });



  //service just for static data parsing in order to debug
  /*angular.module('myApp').service('EventsParsing',function(){
    this.getAllEvents = function(){
       return ([
        {
          component: 'MongoDB',
          url: 'http://www.mongodb.org'
        },
        {
          component: 'Express',
          url: 'http://expressjs.com'
        },
        {
          component: 'AngularJS',
          url: 'http://angularjs.org'
        },
        {
          component: 'Node.js',
          url: 'http://nodejs.org'
        }
      ])
     };
  });*/