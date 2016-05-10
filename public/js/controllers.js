"use strict";

var app = angular.module("socialNetworkApp");

app.controller("mainController", function ($scope, $state, $cookies, $auth, AuthenticationServices) {
    console.log("Main Controller");


    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };


    $scope.submitLogin = function (credentials) {
        $auth.login(credentials)
            .then(function (response) {
                console.log("response: ", response.data)
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };

    $scope.submitLogout = function () {
        return $auth.logout();
    };

    $scope.currentState = $state.current.name;

    $scope.authenticate = function (provider) {
        $auth.authenticate(provider);
    };

    $scope.submitRegistration = function (newAccount) {

        if (newAccount.password !== newAccount.passwordConfirm) {
            alert("Passwords must match.")
        } else {
            $auth.signup(newAccount)
                .then(function (response) {
                    $state.go("home");
                })
                .catch(function (error) {
                    console.log("Error: ", error);
                })
        }
    }


});

app.controller("authentFormController", function ($scope, $state, AuthenticationServices, $auth) {
    console.log("Authenticatate Form Controller");

});




app.controller("editProfileController", function () {
    console.log("Edit Profile Controller")
})