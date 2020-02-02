'use strict'

const jwt = require('jsonwebtoken');

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token){
        res.status(401).json({
            message: 'Acesso restrito'
        })
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if(error){
                res.status(401).json({
                    message: 'Token inválido'
                });
            } else {
                next();
            }
        });
    }
}