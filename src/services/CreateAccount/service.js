const { AppError } = require('../AppError');

class CreateAccountService {
  constructor({ accountRepository, encrypterProvider }) {
    this.accountRepository = accountRepository;
    this.encrypter = encrypterProvider;
  }

  async execute({ email, password }) {
    const emailInUse = await this.accountRepository.findByEmail(email);
    if (emailInUse) { return new AppError('E-mail já está em uso por outro usuário.'); }

    const passwordHashed = await this.encrypter.hash(password);
    const user = await this.accountRepository.create({ email, password: passwordHashed });

    return user;
  }
}
module.exports = { CreateAccountService };
