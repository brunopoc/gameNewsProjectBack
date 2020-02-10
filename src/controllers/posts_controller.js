'use strict'
const mongoose = require('mongoose');
const Posts = mongoose.model('Posts');
const Categories = mongoose.model('Categories');
const stripHtml = require("string-strip-html");

exports.get = async (req, res, next) => {
    const resPerPage = 9; 
    const page = req.params.page || 1;
    try {
        const foundPosts = await Posts.find()
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage)
            .sort({createdAt:-1}) ;
        const numOfPosts = await Posts.count();
        const totalOfPages = numOfPosts / 9;
        res.status(200).send({
            list: foundPosts,
            totalOfPages: totalOfPages,
            currentPage: page
        });
    } catch (err) {
        res.status(400).send({message: "Falha ao carregar as postagens", data: err});
    }
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
    const article = req.body;
    const resume = stripHtml(req.body.content.match(/.{1,200}/g)[0].trim().concat(" ..."));
    let posts = new Posts({ ...article, resume});
    posts
    .save()
    .then(data => {
        res.status(201).send({status: "Success"});
    })
    .catch(e => {
        res.status(400).send({status: "Error", data: e});
    });
};

exports.addCategorie = (req, res, next) => {
    const categorie = req.body;
    let category = new Categories({ ...categorie });
    category
    .save()
    .then(data => {
        res.status(201).send({status: "Success"});
    })
    .catch(e => {
        res.status(400).send({status: "Error", data: e});
    });
};

exports.getCategories = async (req, res, next) => {
    Categories
    .find()
    .then(data => {
        const filteredData = data.map(item => {return {label: item.title, value: item._id}})
        res.status(200).send(filteredData);
    })
    .catch(e => {
        res.status(400).send({message: "Falha ao listar os usuarios", data: e});
    });;
};

exports.postFile = (req, res, next) => {
    const name = req.file.filename || req.file.name;
    res.json({
        uploaded: true,
        url: `http://localhost:4000/files/${name}`
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


