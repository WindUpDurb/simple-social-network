"use strict";

var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    username : { type : String, required : true, unique : true},
    password : { type : String, required : true}
});

userSchema.statics.register = function (userObject, callback) {
    User.create(userObject, callback);
};

userSchema.methods.generateToken = function () {
    var token = jwt.sign({ _id : this._id}, JWT_SECRET);
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
    console.log("login data: ", loginData)
    User.findOne({username : loginData.username}, function (error, userData) {
        console.log("here1")
        if (error || !userData) return callback(error || {error : "Login Failed"});

        if (userData.password !== loginData.password) {
            return callback("Error : ", "Login Failed. Password or username may be incorrect");
        }
        var token = userData.generateToken();
        console.log("Token: ", token);
        callback(null, token);
    })
};


var User = mongoose.model("User", userSchema);

module.exports = User;