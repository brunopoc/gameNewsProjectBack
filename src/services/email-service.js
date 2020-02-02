var config = require("../config");
var sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(config.sendgridKey);
exports.send = async (to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'teste@example.com',
        subject: subject,
        text: "ola mundo",
        html: body
    })
}