"use strict";

var app = angular.module("socialNetworkApp", ["ui.router", "ngCookies"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/",
            controller : "homeController",
            templateUrl : "/html/home.html"
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