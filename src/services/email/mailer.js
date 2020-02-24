const path = require('path');
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

const uri = process.env.SMTP;

const transporter = nodemailer.createTransport(uri);

const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: "layout",
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.hbs',
  };

transporter.use('compile', hbs(handlebarOptions));

module.exports = transporter;
