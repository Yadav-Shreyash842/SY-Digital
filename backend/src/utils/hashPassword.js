const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    const saltRounds = 12;

    return await bcrypt.hash(password, saltRounds);
};

module.exports = hashPassword;