global.SALT_KEY = process.env.SALT_KEY;
global.EMAIL_TMPL = "<strong>{0}</strong>";

module.exports = {
    connectionString: process.env.DB_CONNECT,
};