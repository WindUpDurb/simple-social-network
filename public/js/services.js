"use strict";

var app = angular.module("socialNetworkApp");

app.service("AuthenticationServices", function ($http, $q) {
/*
    this.login = function (credentials) {
      return $http({
          method : "POST",
          url : "/api/users/login",
          data : credentials
      })  
    };

    this.logout = function () {
        return $http({
            method : "DELETE",
            url : "/api/users/logout"
        })
    };
    */
    this.getProfile = function () {
        return $http.get("/api/users/profile")
            .then(function (response) {
                console.log("response: ", response);
                //this.currentUser = response.data;
                return $q.resolve(response.data);
            })
            .catch(function (response) {
                console.log("Catch response: ", response)
               // this.currentUser = null;
                return $q.reject(response.data);
            });
    };


});