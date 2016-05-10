"use strict";

var app = angular.module("socialNetworkApp", ["ui.router", "ngCookies", "satellizer"]);

app.run(function (AuthenticationServices) {
   AuthenticationServices.getProfile();
});

app.config(function ($stateProvider, $urlRouterProvider, $authProvider) {

    $authProvider.github({
        clientId : "40ffd5d50a6a1e5cc866"
    });

    $authProvider.google({
        clientId : "142722290947-shap2c9oha9m43mh7dfubmbkbio10fo1.apps.googleusercontent.com"
    });

    $stateProvider
        .state("home", {
            url : "/",
            views : {
                "" : {
                    controller : "authentFormController",
                    templateUrl : "/html/home.html"
                },

                "login-register" : {
                    controller : "authentFormController",
                    templateUrl : "/html/login.html"
                }
            }

        })
        .state("registration", {
            url : "/register",
            views : {
                "login-register" : {
                    controller : "authentFormController",
                    templateUrl : "/html/registration.html"
                }
            }

        })
        .state("editProfile", {
            url : "/editProfile",
            controller : "editProfileController",
            templateUrl : "/html/editProfile.html"
        })

    $urlRouterProvider.otherwise("/");
});