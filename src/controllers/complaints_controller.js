"use strict";
const mongoose = require("mongoose");
const Complaints = mongoose.model("Complaints");
const stripHtml = require("string-strip-html");
const format = require("../services/utils/format");

exports.get = async (req, res, next) => {
  const resPerPage = 8;
  const page = req.params.page || 1;
  try {
    const foundComplaints = await Complaints.find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfComplaints = await Complaints.count();
    const totalOfPages = numOfComplaints / resPerPage;
    res.status(200).send({
      complaints: foundComplaints,
      totalOfPages: totalOfPages,
      currentPage: page
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Falha ao carregar as reclamações", data: err });
  }
};

exports.post = (req, res, next) => {
  const { accused, informer, refer, info } = req.body;
  let complaints = new Complaints({
    accused, informer, refer, info
  });
  complaints
    .save()
    .then(data => {
      res.status(201).send({ status: "Success" });
    })
    .catch(e => {
      res.status(400).send({ status: "Error", data: e });
    });
};
