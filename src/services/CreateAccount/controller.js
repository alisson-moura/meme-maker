const { AppError } = require('../AppError');
const { BaseController } = require('../BaseController');
const { CreateAccountService } = require('./service');
const { AccountRepository } = require('../../database/AccountRepository');
const { Encrypter } = require('../../providers/encrypter');

class CreateAccounController extends BaseController {
  async handle(request, response, renderView) {
    if (renderView !== undefined) {
      return this.successRequest(response, renderView);
    }

    const { email, password } = request.body;
    if ((!email || !password) || (password.length < 6 || email.length < 6)) {
      return this.badRequest(response, 'create-account', { error: 'E-mail ou senha inválidos' });
    }

    const createAccountService = new CreateAccountService({
      accountRepository: new AccountRepository(),
      encrypterProvider: new Encrypter(),
    });
    const result = await createAccountService.execute({ email, password });
    if (result instanceof AppError) {
      return this.badRequest(response, 'create-account', { error: result.message });
    }

    return this.successRequest(response, 'create-account', { success: 'Conta criada' });
  }
}

module.exports = { CreateAccounController };
