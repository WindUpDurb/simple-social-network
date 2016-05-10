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


router.post("/google", function (request, response) {
    var accessTokenUrl = "https://accounts.google.com/o/oauth2/token";
    var peopleApiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";

    var params = {
        code : request.body.code,
        client_id : request.body.clientId,
        client_secret : process.env.GOOGLE_SECRET,
        redirect_uri : request.body.redirectUri,
        grant_type : "authorization_code"
    };

    requestModule.post(accessTokenUrl, { json: true, form: params }, function (error, responseR, token) {
        var accessToken = token.access_token;
        var headers = { Authorization: 'Bearer ' + accessToken };

        requestModule.get({ url : peopleApiUrl, headers : headers, json : true}, function (error, responseR, profile) {
            if (profile.error) {
                console.log(profile.error)
                return response.status(500).send({ message : profile.error.message});
            }


            if (request.header("Authorization")) {
                User.findOne({ google : profile.sub }, function (error, existingUser) {
                    if (existingUser) return response.status(409).send({ message : "There is already a Google Account that belongs to you"});

                    var token = request.header("Authorization").split(" ")[1];
                    var payload = jwt.decode(token, process.env.JWT_SECRET);

                    User.findById(payload.sub, function (error, savedUser) {
                        if (!savedUser) return response.status(400).send({ message : "User not found."});

                        user.google = profile.sub;
                        user.picture = user.picture || profile.picture.replace("sz=50", "sz=200");
                        user.displayName = user.displayName || profile.name;
                        user.save(function () {
                            var token = savedUser.generateToken();
                            response.send({ token : token});
                        });
                    });
                });
            } else {
                User.findOne({ google : profile.sub }, function (error, existingUser) {
                    if (existingUser) return response.send({ token : existingUser.generateToken()});

                    var newUser = new User();
                    newUser.google = profile.sub;
                    newUser.picture = profile.picture.replace("sz=50", "sz=200");
                    newUser.displayName = profile.name;
                    newUser.save(function (error) {
                        var token = newUser.generateToken();
                        response.send({ token : token });
                    });
                });
            }
        });
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