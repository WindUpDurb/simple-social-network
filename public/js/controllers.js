"use strict";

var app = angular.module("socialNetworkApp");

app.controller("mainController", function ($scope, $cookies, $auth, AuthenticationServices) {
    console.log("Main Controller");


    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };


    $scope.submitLogin = function (credentials) {
        $auth.login(credentials);
    };

    $scope.submitLogout = function () {
        return $auth.logout();
    };

});

app.controller("authentFormController", function ($scope, $state, AuthenticationServices, $auth) {
    console.log("Authenticatate Form Controller");
    $scope.currentState = $state.current.name;

    $scope.authenticate = function (provider) {
        $auth.authenticate(provider);
    };


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