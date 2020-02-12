"use strict";
const mongoose = require("mongoose");
const Posts = mongoose.model("Posts");
const Categories = mongoose.model("Categories");
const stripHtml = require("string-strip-html");
const format = require("../services/utils/format");

exports.get = async (req, res, next) => {
  const resPerPage = 9;
  const page = req.params.page || 1;
  try {
    const foundPosts = await Posts.find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count();
    const totalOfPages = numOfPosts / 9;
    res.status(200).send({
      list: foundPosts,
      totalOfPages: totalOfPages,
      currentPage: page
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as postagens", data: err });
  }
};

exports.getOne = (req, res, next) => {
  Posts.findOne({ refer: req.params.refer })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(e => {
      res
        .status(400)
        .send({ message: "Falha ao carregar a postagem", data: e });
    });
};

exports.post = (req, res, next) => {
  const article = req.body;
  const refer = format.convertToSlug(article.title);
  const resume = stripHtml(
    req.body.content
      .match(/.{1,200}/g)[0]
      .trim()
      .concat(" ...")
  );
  let posts = new Posts({ ...article, resume, refer });
  posts
    .save()
    .then(data => {
      res.status(201).send({ status: "Success" });
    })
    .catch(e => {
      res.status(400).send({ status: "Error", data: e });
    });
};

exports.addCategorie = (req, res, next) => {
  const categorie = req.body;
  let category = new Categories({ ...categorie });
  category
    .save()
    .then(data => {
      res.status(201).send({ status: "Success" });
    })
    .catch(e => {
      res.status(400).send({ status: "Error", data: e });
    });
};

exports.getCategories = async (req, res, next) => {
  Categories.find()
    .then(data => {
      const filteredData = data.map(item => {
        return { label: item.title, value: item._id };
      });
      res.status(200).send(filteredData);
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao listar os usuarios", data: e });
    });
};

exports.postFile = (req, res, next) => {
  const name = req.file.filename || req.file.name;
  res.json({
    uploaded: true,
    url: `http://localhost:4000/files/${name}`
  });
};

exports.updateLikes = async (req, res, next) => {
  const id = req.params.id;
  const action = req.body.action;
  const counter = action === "Liked" ? 1 : -1;
  Posts.findByIdAndUpdate(id, { $inc: { likes: counter } })
    .then(async ({ likes, _id }) => {
      const likesRef = likes + counter;
      res.status(200).send({
        _id,
        likes: likesRef
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao curtir a Postagem", data: e });
    });
};

exports.postComment = async (req, res, next) => {
  const id = req.params.id;
  const comments = req.body;
  Posts.findByIdAndUpdate(id, { comments })
    .then(async ({ _id }) => {
      res.status(200).send({
        _id,
        ...comments
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao comentar", data: e });
    });
};
