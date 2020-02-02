'use strict'
const mongoose = require('mongoose');
const User = mongoose.model('User');
const md5 = require('md5');
const emailService = require('../services/email-service');
const { generateToken } = require('../services/utils/token.utils');

exports.get = (req, res, next) => {
    User
    .find({}, 'name email')
    .then(data => {
        res.status(200).send(data);
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar os usuarios", data: e});
    });;
};

exports.singup = (req, res, next) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password + global.SALT_KEY)
    });
    user
    .save()
    .then(async (data) => {
        const {_id: id, name, email} = data;
        const token = await generateToken({
            email, name, id
        });
        emailService.send(email, "Bem Vindo", global.EMAIL_TMPL.replace('{0}', name));
        res.status(201).send({
            token,
            data: {
                email, name
            }});
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao cadastrar o usuario", data: e});
    });
};

exports.login = async (req, res, next) => {
    User
    .findOne({
        email: req.body.email,
        password: md5(req.body.password + global.SALT_KEY)
    })
    .then(async ({_id: id, name, email}) => {
        if(!id) {   
             res.status(400).send({message: "Usuario ou senha invalidos"});           
        }
        const token = await generateToken({
            email, name, id
        });
        res.status(200).send({
            token,
            data: {
                email, name
            }
        });
        
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar os usuarios", data: e});
    });;
};


