'use strict'

const jwt = require('jsonwebtoken');

const createToken = function(data) {
    return jwt.sign(data, global.SALT_KEY, {expiresIn: 60 * 120});
};

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

exports.generateToken = function(data) {
    return createToken(data);
}

exports.generateAuthToken = function(req, res, next) {
    
    req.token = createToken(req.auth);
    return next();
}

exports.sendToken = function(req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
}