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
      var user = null;
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


    //Logs out the user
    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
      // handle success
        .success(function (data) {
        user = false;
        deferred.resolve();
      })
      // handle error
        .error(function (data) {
        user = false;
        deferred.reject();
      });

      // return promise object
      return deferred.promise;

    }




    
    //Log in
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
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }


    //Gets the user's username from backend
    //(Does not return)
    function refreshUserName(){
      
      var deferred = $q.defer();

      // send a post request to the server
      $http.get('/user/userName')
      // handle success
      .success(function (data,status) {
      if(status === 200 && data.username){
        console.log('SERVICE: Success!')
        username=data.username;
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



//username=getUserName();

return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      getUserName: getUserName,
      refreshUserName: refreshUserName,
      login: login,
      logout: logout,
      register: register
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