"use strict";
const mongoose = require("mongoose");
const Posts = mongoose.model("Posts");
const Categories = mongoose.model("Categories");
const Upload = mongoose.model("Upload");
const stripHtml = require("string-strip-html");
const format = require("../services/utils/format");
const { decodeToken } = require("../services/utils/token.utils");

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

exports.getByCategory = async (req, res, next) => {
  const resPerPage = 8;
  const page = req.params.page || 1;
  const category = req.params.category;
  try {
    const foundPosts = await Posts.find({
      "categories.value": category,
      aprove: "aproved"
    })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count({
      "categories.value": category,
      aprove: "aproved"
    });
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

exports.getByTags = async (req, res, next) => {
  const resPerPage = 8;
  const page = req.params.page || 1;
  const tags = req.params.tags;
  try {
    const foundPosts = await Posts.find({
      "tags.value": tags,
      aprove: "aproved"
    })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count({
      "tags.value": tags,
      aprove: "aproved"
    });
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

exports.getSimilar = async (req, res, next) => {
  const resPerPage = 3;
  try {
    const foundPosts = await Posts.aggregate([
      { $match: { aprove: "aproved" } },
      { $sample: { size: resPerPage } }
    ]);
    res.status(200).send({
      similar: foundPosts
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as postagens", data: err });
  }
};

exports.getPersonal = async (req, res, next) => {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  const data = await decodeToken(token);
  const resPerPage = 5;
  const page = req.params.page || 1;
  try {
    const foundPosts = await Posts.find({
      "author.id": data.id,
      $or: [{ aprove: "pending" }, { aprove: "aproved" }]
    })
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfPosts = await Posts.count({ "author.id": data.id });
    const totalOfPages = numOfPosts / resPerPage;
    res.status(200).send({
      personalPosts: foundPosts,
      totalOfPersonalPages: totalOfPages,
      currentPersonalPage: page
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
      Posts.findByIdAndUpdate(data.id, { $inc: { views: 1 } });
      res.status(200).send(data);
    })
    .catch(e => {
      res
        .status(400)
        .send({ message: "Falha ao carregar a postagem", data: e });
    });
};

exports.getmostViewedsInWeek = async (req, res, next) => {
  const resPerPage = 10;
  try {
    const foundPosts = await Posts.find({
      aprove: "aproved",
      createdAt: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
      }
    })
      .sort({ views: -1 })
      .limit(resPerPage);
    res.status(200).send({
      mostViewedInWeek: foundPosts
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as postagens", data: err });
  }
};

exports.getmostLikedInWeek = async (req, res, next) => {
  const resPerPage = 10;
  try {
    const foundPosts = await Posts.find({
      aprove: "aproved",
      createdAt: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
      }
    })
      .sort({ likes: -1 })
      .limit(resPerPage);
    res.status(200).send({
      mostLikedInWeek: foundPosts
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as postagens", data: err });
  }
};

exports.post = (req, res, next) => {
  const { title, content, image, categories, tags, id, author } = req.body;
  let tagsRef;
  if (tags) {
    tagsRef = tags.map(tag => ({
      ...tag,
      value: format.convertToSlug(tag.value)
    }));
  }
  const refer = format.convertToSlug(title);
  const resume = stripHtml(
    content
      .match(/.{1,200}/g)[0]
      .trim()
      .concat(" ...")
  );
  if (!!id) {
    Posts.findByIdAndUpdate(id, {
      $set: {
        title,
        resume,
        refer,
        content,
        image,
        categories,
        tags: tagsRef
      }
    })
      .then(data => {
        res.status(201).send({ status: "Success" });
      })
      .catch(e => {
        res.status(400).send({ status: "Error", data: e });
      });
  } else {
    let posts = new Posts({
      title,
      resume,
      refer,
      content,
      image,
      categories,
      tags: tagsRef,
      author
    });
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
  const value = format.convertToSlug(categorie.label);
  let category = new Categories({ ...categorie, value: value });
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
      res.status(200).send(data);
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao listar os usuarios", data: e });
    });
};

exports.postFile = (req, res, next) => {
  const name = req.file.filename || req.file.name;
  const { location: url = `http://localhost:4000/files/${name}` } = req.file;

  let uploadFile = new Upload({ url });
  uploadFile
    .save()
    .then(data => {
      res.status(201).send({ status: "Success", uploaded: true, url });
    })
    .catch(e => {
      res.status(400).send({ status: "Error", data: e });
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
    {
      $set: {
        aprove
      }
    },
    { new: true }
  )
    .then(async ({ aprove, _id: id }) => {
      res.status(200).send({
        id,
        aprove
      });
    })
    .catch(e => {
      res
        .status(400)
        .send({ message: "Falha ao aprovar a publicação", data: e });
    });
};
