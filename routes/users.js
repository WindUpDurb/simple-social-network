"use strict";

var express = require("express");
var router = express.Router();

var User = require("../models/user");

router.route("/")
    .get(function (request, response) {
        User.find({}, function (error, users) {
            if (error) return response.status(400).send(error);
            response.send(users);
        })
    })

router.post("/register", function (request, response) {
    User.register(request.body, function (error) {
        if (error) response.status(400).send();
        response.send("User Registered");
    })
});

router.post("/login", function (request, response) {

    console.log(request.body)

    User.authenticate(request.body, function (error, token) {
        if (error) return response.status(400).send(error);
        response.cookie("accessToken", token).send(token);
    });

});

router.delete("/logout", function (request, response) {
   response.clearCookie("accessToken").send();
});

router.route("/profile")
    .get(User.isLoggedIn, function (request, response) {
        console.log("request in node: ", request.user)
        response.send(request.user);
    })
    .post(User.isLoggedIn, function (request, response) {
        //User.find({username : request.body.username}, function ())
    })

module.exports = router;