"use strict";

var app = angular.module("socialNetworkApp");

app.controller("homeController", function ($scope, $cookies, AuthenticationServices) {
    console.log("Home Controller");


    AuthenticationServices.loggedInState()
        .then(function (response) {
            $scope.activeUser = response.data;
        })
        .catch(function () {
            $scope.activeUser = null;
        })


    $scope.submitLogin = function (credentials) {
        console.log(credentials)
        AuthenticationServices.login(credentials)
            .then(function (response) {
                console.log(response.data);
                return AuthenticationServices.loggedInState()
            })
            .then(function (response) {
                $scope.activeUser = response.data
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    };

    $scope.submitLogout = function () {
        AuthenticationServices.logout()
            .then(function (response) {
                $scope.activeUser = null;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    }

});

app.controller("registrationController", function ($scope, $state, AuthenticationServices) {
   console.log("Registration")

    $scope.submitRegistration = function (newAccount) {
        AuthenticationServices.registerNewAccount(newAccount)
            .then(function (response) {
                alert("Your account has been created");
                $state.go("home");
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    }

});


app.controller("editProfileController", function () {
    console.log("Edit Profile Controller")
})