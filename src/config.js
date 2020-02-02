global.SALT_KEY = process.env.SALT_KEY;
global.EMAIL_TMPL = "<strong>{0}</strong>";

module.exports = {
    'facebookAuth' : {
        'clientID'      : process.env.CLIENT_ID,
        'clientSecret'  : process.env.CLIENT_SECRET,
        'callbackURL'     : process.env.CALLBACK_URL,
        'profileURL': process.env.PROFILE_URL

    },
    connectionString: "mongodb://192.168.99.100:27017/gameapi",
    sendgridKey: process.env.SENDGRIDKEY,
    containerConnectionString: "TDB"
};