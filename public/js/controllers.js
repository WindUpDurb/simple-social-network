"use strict";

var app = angular.module("socialNetworkApp");

app.controller("mainController", function ($scope, $state, $cookies, $auth, AuthenticationServices) {
    console.log("Main Controller");

    AuthenticationServices.getProfile()
        .then(function (response) {
            $scope.activeUser = response;
            console.log("$scope.activeUser: ", $scope.activeUser)
        })
        .catch(function (error) {
           console.log("Error: ", error);
        });


    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };


    $scope.submitLogin = function (credentials) {
        $auth.login(credentials)
            .then(function (response) {

            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };

    $scope.submitLogout = function () {
         $auth.logout()
             .then(function (response) {
                 $scope.activeUser = null;
             })
             .catch(function (error) {
                 console.log("Error: ", error);
             })
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




app.controller("editProfileController", function ($scope, $state, AuthenticationServices) {
    console.log("Edit Profile Controller");

    $scope.submitEdits = function (edits) {
        var updatedData = angular.copy(edits);
        updatedData._id = $scope.activeUser._id;
        AuthenticationServices.updateProfile(updatedData)
            .then(function (response) {
                $scope.activeUser = response.body;
                $state.go("home");
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    }

})