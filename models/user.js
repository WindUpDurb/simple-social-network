"use strict";

var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    email : { type : String, unique : true},
    password : { type : String},
    github : { type: String }
});

userSchema.statics.register = function (userObject, callback) {
    User.findOne({ email : userObject.email}, function (error, userData) {
        if (error || userData) return callback(error || { error : "Email Not Available" });

        bcrypt.hash(userObject.password, 12, function (error, hash) {
            if (error) return callback(error);

            var user = new User({
                email : userObject.email,
                password : hash
            })
            user.save(callback);
        });
    });
};

userSchema.methods.generateToken = function () {
    var token = jwt.sign({
        _id : this._id
    }, JWT_SECRET);
    return token;
};

userSchema.statics.isLoggedIn = function (request, response, next) {

    var token = request.cookies.accessToken;
    jwt.verify(token, JWT_SECRET, function (error, payload) {
        if (error) return response.status(401).send({error : "Must be authenticated"});

        User.findById(payload._id, function (error, userData) {
            if (error || !userData) return response.clearCookie("accessToken").status(400).send(error || {error : "User not found"});
            request.user = userData;
            next();
        }).select({password : false})
    })

};

userSchema.statics.authenticate = function (loginData, callback) {
    User.findOne({email : loginData.email}, function (error, userData) {
        console.log("here1")
        if (error || !userData) return callback(error || {error : "Login Failed. Email or Password is Incorrect"});

        bcrypt.compare(loginData.password, userData.password, function (error, isGood) {
            if (error || !isGood) return callback(error || { error : "Login Failed. Email or Password Incorrect"});

            var token = userData.generateToken();

            callback(null, token);
        });
    });
};


var User = mongoose.model("User", userSchema);

module.exports = User;