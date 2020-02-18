'use strict'

const jwt = require('jsonwebtoken');
const { decodeToken } = require('../services/utils/token.utils');

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

exports.authorizeAdmin = async function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token){
        res.status(401).json({
            message: 'Acesso restrito'
        })
    } else {
        const data = await decodeToken(token);
        if( data.type !== "admin" ) {
            res
              .status(401)
              .send({ message: "Você não tem permissão para acessar essa pagína" });
        }
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