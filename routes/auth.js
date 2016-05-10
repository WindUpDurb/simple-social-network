"use strict";

var express = require("express");
var router = express.Router();

var requestModule = require("request");
var qs = require("qs");
var User = require("../models/user");

router.post("/login", function (request, response) {
    User.authenticate(request.body, function (error, token) {
        if (error) return response.status(400).send(error);

        response.send({ token : token });
    });
});

router.post("/signup", function (request, response) {
    User.register(request.body, function (error, user) {
        if (error) return response.status(400).send(error);

        var token = user.generateToken();
        response.send({ token : token});
    });
});


router.post("/github", function (request, response) {
    var accessTokenUrl = "https://github.com/login/oauth/access_token";
    var userApiUrl = "https://api.github.com/user";

    var params = {
        code : request.body.code,
        client_id : request.body.clientId,
        redirect_uri : request.body.redirectUri,
        client_secret : process.env.GITHUB_SECRET
    };

    requestModule.get({ url : accessTokenUrl, qs : params}, function (error, responseR, body ) {
        if (error) return response.status(400).send(error);

        var accessToken = qs.parse(body);
        var headers = { "User-Agent" : "satellizer" };

        requestModule.get({ url : userApiUrl, qs : accessToken, headers : headers, json : true }, function (error, responseR, profile) {
            if (error) return response.status(400).send(error);

            User.findOne( { github : profile.id }, function (error, existingUser) {
                if (error) return response.status(400).send(error);

                if(existingUser) {
                    var token = existingUser.generateToken();
                    response.send({ token : token });
                } else {
                    var user = new User();
                    user.github = profile.id;

                    user.save(function (error, savedUser) {
                        var token = savedUser.generateToken();
                        response.send({ token : token });
                    });
                }
            });
        });
    });
});

module.exports = router;