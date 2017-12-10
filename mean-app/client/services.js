angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    if(!isLoggedIn())
    {
    var user = null;
    var username="anonymous";
    }

    function isLoggedIn() 
    {
      if(user) 
      {
        return true;
      } 
      else 
      {
        return false;
      }
    }


    function logout() 
    {

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

    function login(username, password) 
    {
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


    function refreshUserName(){
      
      console.log('SERVICE: refreshing username');

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
      
    function getUserName(){
      console.log('SERVICE: getting username')
      return username;
    }  

    function getUserStatus() {
    var deferred = $q.defer();

    console.log('SERVICE: getting userStatus')
    $http.get('/user/status')
    // handle success
      .success(function (data) {
      if(data.status){
        console.log('SERVICE: Success if')
        user = true;
        deferred.resolve();

      } else {
        console.log('SERVICE: Success else')
        user = false;
        deferred.resolve();

      }
    })
    // handle error
    .error(function (data) {
      console.log('SERVICE: error')
      user = false;
     deferred.reject();

    });
    return deferred.promise;
    }


    function register(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/user/register',
      {username: username, password: password})
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