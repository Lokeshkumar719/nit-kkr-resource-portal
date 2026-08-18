const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
};

module.exports = hashPassword;
