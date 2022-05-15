const { AppError } = require('../AppError');
const { BaseController } = require('../BaseController');
const { CreateSessionService } = require('./service');

class SessionController extends BaseController {
  async handle(request, response) {
    // logout request
    if (request.url === '/logout') {
      request.session.destroy();
      response.clearCookie('connect.sid');
      return this.redirectResponse(response, '/login');
    }
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

module.exports = { SessionController };
