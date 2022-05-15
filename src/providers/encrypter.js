const bcrypt = require('bcrypt');

class Encrypter {
  constructor() {
    this.saltRounds = 10;
  }

  async hash(password) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const result = await bcrypt.hash(password, salt);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async compare(passwordPlain, hashedPassword) {
    const result = await bcrypt.compare(passwordPlain, hashedPassword);
    return result;
  }
}
module.exports = { Encrypter };
