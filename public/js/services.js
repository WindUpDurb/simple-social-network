"use strict";

var app = angular.module("socialNetworkApp");

app.service("AuthenticationServices", function ($http) {

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
    
    this.loggedInState = function () {
        return $http.get("/api/users/profile")
    };

    this.registerNewAccount = function (newAccount) {
        return $http({
            method : "POST",
            url : "/api/users/register",
            data : newAccount
        })
    };
    
    this.saveProfileEdits = function (edits) {
        return $http({
            
        })
    }

});