"use strict";
const mongoose = require("mongoose");
const User = mongoose.model("User");
const md5 = require("md5");
const { generateToken, decodeToken } = require("../services/utils/token.utils");
const crypto = require("crypto");
const mailer = require("../services/email/mailer");

exports.get = async (req, res, next) => {
  const resPerPage = 5;
  const page = req.params.page || 1;

  try {
    const foundUsers = await User.find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .sort({ createdAt: -1 });
    const numOfUsers = await User.count();
    const totalOfPages = numOfUsers / resPerPage;
    res.status(200).send({
      users: foundUsers,
      totalOfUsers: totalOfPages,
      currentUsersPage: page
    });
  } catch (err) {
    res.status(400).send({ message: "Falha ao listar os usuarios", data: e });
  }
};

exports.singup = (req, res, next) => {
  const emailToken = crypto.randomBytes(20).toString("hex");
  const { email, name, password, nickname } = req.body;
  let user = new User({
    name: name,
    email: email,
    nickname,
    password: md5(password + global.SALT_KEY),
    emailConfirmToken: emailToken
  });
  user
    .save()
    .then(async ({ _id: id, name, email, likedPosts, type, nickname }) => {
      mailer.sendMail(
        {
          to: email,
          from: "suporte@sougamercomorgulho.com.br",
          subject: "Confirme seu Email - Bem Vindo ao Sou Gamer Com Orgulho!",
          template: "confirmemail",
          context: { token: emailToken, name }
        },
        err => {
          if (err) {
            res.status(400).send({ message: "emailNotSend", data: err });
          }
        }
      );

      const userToken = await generateToken({
        email,
        nickname,
        id,
        type
      });

      res.status(201).send({
        token: userToken,
        data: {
          email,
          name,
          nickname,
          id,
          likedPosts,
          type
        }
      });
    })
    .catch(e => {
      res
        .status(400)
        .send({ message: "Falha ao cadastrar o usuario", data: e });
    });
};

exports.login = async (req, res, next) => {
  User.findOne({
    email: req.body.email,
    password: md5(req.body.password + global.SALT_KEY),
    blocked: false
  })
    .then(async ({ _id: id, name, email, type, likedPosts, avatar }) => {
      if (!id) {
        res.status(400).send({ message: "Usuario ou senha invalidos" });
      }
      const token = await generateToken({
        email,
        name,
        id,
        type
      });
      res.status(200).send({
        token,
        data: {
          email,
          name,
          id,
          likedPosts,
          avatar,
          type
        }
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao logar o usuario", data: e });
    });
};

exports.forgetpassword = async (req, res, next) => {
  User.findOne({
    email: req.body.email
  })
    .then(async ({ _id: id, email }) => {
      if (!id) {
        res.status(400).send({ message: "mailNotFound" });
      }
      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(
        id,
        {
          $set: {
            passwordResetToken: token,
            passwordResetExpires: now
          }
        },
        { new: true }
      );

      mailer.sendMail(
        {
          to: email,
          from: "suporte@sougamercomorgulho.com.br",
          template: "forgotpassword",
          subject: "Resete sua senha - Sou Gamer Com Orgulho!",
          context: { token }
        },
        err => {
          if (err) {
            res.status(400).send({ message: "emailNotSend", data: err });
          }
          res.status(200).send({ message: "Success" });
        }
      );
    })
    .catch(e => {
      res.status(400).send({ message: "errorOcurred", data: e });
    });
};

exports.resetpassword = async (req, res, next) => {
  const { email, token, password } = req.body;
  try {
    const user = await User.findOne({
      email: email
    }).select("+passwordResetToken passwordResetExpires");

    if (!user) return res.status(400).send({ message: "userNotFound" });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ message: "invalidToken" });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res.status(400).send({ message: "expiredToken" });

    user.password = md5(password + global.SALT_KEY);

    user.save();

    res.status(200).send({ message: "Success" });
  } catch (err) {
    res.status(400).send({ message: "cantResetPassword", data: err });
  }
};

exports.confirmemail = async (req, res, next) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({
      emailConfirmToken: token
    }).select("+emailConfirmToken");

    if (!user) return res.status(400).send({ message: "userNotFound" });

    if (token !== user.emailConfirmToken)
      return res.status(400).send({ message: "invalidToken" });

    user.emailChecked = true;

    user.save();

    res.status(200).send({ message: "Success" });
  } catch (err) {
    res.status(400).send({ message: "cantResetPassword", data: err });
  }
};

exports.myuser = async (req, res, next) => {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  const data = await decodeToken(token);
  User.findOne({
    email: data.email
  })
    .then(async ({ _id: id, name, email, type, likedPosts, avatar }) => {
      if (!id) {
        res.status(400).send({ message: "Usuario não encontrado" });
      }
      const token = await generateToken({
        email,
        name,
        id,
        type
      });
      res.status(200).send({
        token,
        data: {
          email,
          name,
          id,
          likedPosts,
          avatar,
          type
        }
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao listar o usuario", data: e });
    });
};

exports.updateLikedPosts = async (req, res, next) => {
  const { likedPosts, id } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      $set: {
        likedPosts
      }
    },
    { new: true }
  )
    .then(async ({ name, email, likedPosts }) => {
      res.status(200).send({
        data: {
          email,
          name,
          id,
          likedPosts
        }
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao curtir", data: e });
    });
};

exports.updateProfile = async (req, res, next) => {
  const { avatar, id, name } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        avatar
      }
    },
    { new: true }
  )
    .then(async ({ name, email, avatar }) => {
      res.status(200).send({
        data: {
          email,
          name,
          id,
          avatar
        }
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao curtir", data: e });
    });
};

exports.updateBlocked = async (req, res, next) => {
  const { blocked, id } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      $set: {
        blocked
      }
    },
    { new: true }
  )
    .then(async ({ blocked }) => {
      res.status(200).send({
        id,
        blocked
      });
    })
    .catch(e => {
      res.status(400).send({ message: "Falha ao curtir", data: e });
    });
};
