"use strict";
const mongoose = require("mongoose");
const Posts = mongoose.model("Posts");
const Categories = mongoose.model("Categories");
const stripHtml = require("string-strip-html");
const format = require("../services/utils/format");

exports.get = async (req, res, next) => {
  const resPerPage = 8;
  const page = req.params.page || 1;
  try {
    const foundPosts = await Posts.find({ aprove: "aproved" })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count({ aprove: "aproved" });
    const totalOfPages = numOfPosts / resPerPage;
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

exports.getPending = async (req, res, next) => {
  const resPerPage = 5;
  const page = req.params.page || 1;

  try {
    const foundPosts = await Posts.find({ aprove: "pending" })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count({ aprove: "pending" });
    const totalOfPages = numOfPosts / resPerPage;
    res.status(200).send({
      pending: foundPosts,
      totalOfPendingPages: totalOfPages,
      currentPendingPage: page
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as postagens", data: err });
  }
};

exports.getAll = async (req, res, next) => {
  const resPerPage = 5;
  const page = req.params.page || 1;

  try {
    const foundPosts = await Posts.find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count();
    const totalOfPages = numOfPosts / resPerPage;
    res.status(200).send({
      allPosts: foundPosts,
      totalOfAllPages: totalOfPages,
      currentAllPage: page
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
  const { title, content, image, categories, tags, id, author } = req.body;
  const refer = format.convertToSlug(title);
  const resume = stripHtml(
    content
      .match(/.{1,200}/g)[0]
      .trim()
      .concat(" ...")
  );
  if(!!id) { 
    Posts.findByIdAndUpdate(id, {
      $set: {
        title, resume, refer, content, image, categories, tags
      }
    })
    .then(data => {
      res.status(201).send({ status: "Success" });
    })
    .catch(e => {
      res.status(400).send({ status: "Error", data: e });
    });  

  } else {
    let posts = new Posts({ title, resume, refer, content, image, categories, tags, author });
    posts
      .save()
      .then(data => {
        res.status(201).send({ status: "Success" });
      })
      .catch(e => {
        res.status(400).send({ status: "Error", data: e });
      });
  }
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
  const { location: url = `http://localhost:4000/files/${name}` } = req.file;
  res.json({
    uploaded: true,
    url
  });
};

exports.updateLikes = async (req, res, next) => {
  const id = req.params.id;
  const action = req.body.action;
  const counter = action === "Liked" ? 1 : -1;
  Posts.findByIdAndUpdate(id, { $inc: { likes: counter } }, { new: true })
    .then(async ({ likes, _id: id }) => {
      res.status(200).send({
        id,
        likes
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao curtir a Postagem", data: e });
    });
};

exports.postComment = async (req, res, next) => {
  const id = req.params.id;
  const commentsData = req.body;
  Posts.findByIdAndUpdate(id, { comments: commentsData }, { new: true })
    .then(async ({ _id, comments }) => {
      res.status(200).send({
        _id,
        comments
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao comentar", data: e });
    });
};

exports.updatePendingPost = async (req, res, next) => {
  const id = req.params.id;
  const { aprove } = req.body;
  Posts.findByIdAndUpdate(
    id,
    {$set: {
      aprove
    }},
    { new: true }
  )
    .then(async ({ aprove, _id: id }) => {
      res.status(200).send({
        id,
        aprove
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao aprovar a publicação", data: e });
    });
};
