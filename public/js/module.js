"use strict";

var app = angular.module("socialNetworkApp", ["ui.router", "ngCookies", "satellizer"]);

app.run(function (AuthenticationServices) {
   AuthenticationServices.getProfile();
});

app.config(function ($stateProvider, $urlRouterProvider, $authProvider) {

    $authProvider.github({
        clientId : "40ffd5d50a6a1e5cc866"
    });

    $stateProvider
        .state("home", {
            url : "/",
            views : {
                "" : {
                    controller : "authentFormController",
                    templateUrl : "/html/home.html"
                },

                "login" : {
                    controller : "authentFormController",
                    templateUrl : "/html/login.html"
                }
            }

        })
        .state("registration", {
            url : "/register",
            controller : "registrationController",
            templateUrl : "/html/registration.html"
        })
        .state("editProfile", {
            url : "/editProfile",
            controller : "editProfileController",
            templateUrl : "/html/editProfile.html"
        })

    $urlRouterProvider.otherwise("/");
});