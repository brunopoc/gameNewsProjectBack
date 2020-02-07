'use strict'
const mongoose = require('mongoose');
const Posts = mongoose.model('Posts');

exports.get = (req, res, next) => {
    Posts
    .find({}, 'id title')
    .then(data => {
        res.status(200).send(data);
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar as postagens", data: e});
    });;
};

exports.getOne = (req, res, next) => {
    Posts
    .findOne({id: req.body.id}, 'title text post_type images_url post_schedule')
    .then(data => {
        res.status(200).send(data);
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar as postagens", data: e});
    });;
};

exports.post = (req, res, next) => {
    let posts = new Posts(req.body);
    posts
    .save()
    .then(data => {
        res.status(201).send({message: "Postagem cadastrado com sucesso!"});
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao cadastrar uma postagem", data: e});
    });
};

exports.postFile = (req, res, next) => {
        res.json({
          uploaded: true,
          url: `${process.env.BASE_URL}/${req.file.filename}`
        });
};

exports.put = async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;
    Posts
    .findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            text: data.text,
            post_type: data.post_type,
            images_url: data.images_url,
            post_schedule: data.post_schedule
        }
    })
    .then(async data => {
        res.status(200).send({
            message: "Postagem atualizada com sucesso!"
        });
        
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar a Postagem", data: e});
    });;
};


