const { AppError } = require('../AppError');
const { BaseController } = require('../BaseController');
const { CreateSessionService } = require('./service');

class CreateSessionController extends BaseController {
  async handle(request, response) {
    const { email, password } = request.body;
    if ((!email || !password) || (password.length < 6 || email.length < 6)) {
      return this.badRequest(response, 'login', { error: 'E-mail ou senha inválidos' });
    }

    const createSessionService = new CreateSessionService();
    const result = await createSessionService.execute(email, password);
    if (result instanceof AppError) {
      return this.badRequest(response, 'login', { error: result.message });
    }

    request.session.isAuth = true;
    request.session.userId = result.id;
    return this.redirectResponse(response, '/');
  }
}

module.exports = { CreateSessionController };
