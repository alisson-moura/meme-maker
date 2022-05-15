const { AccountRepository } = require('../../database/AccountRepository');
const { Encrypter } = require('../../providers/encrypter');
const { AppError } = require('../AppError');

class CreateSessionService {
  constructor() {
    this.accountsRepository = new AccountRepository();
    this.encrypter = new Encrypter();
  }

  async execute(email, password) {
    const user = await this.accountsRepository.findByEmail(email);
    if (user === undefined) return new AppError('E-mail ou senha inválidos');

    const checkPassword = await this.encrypter.compare(password, user.password);
    if (!checkPassword) return new AppError('E-mail ou senha inválidos');
    delete user.password;
    return user;
  }
}
module.exports = { CreateSessionService };
