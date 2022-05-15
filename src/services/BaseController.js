const { logger } = require('../providers/logger');

/* eslint-disable class-methods-use-this */
class BaseController {
  async execute(request, response, renderView) {
    try {
      if (renderView) {
        return this.successRequest(response, renderView);
      }
      return this.handle(request, response);
    } catch (error) {
      return this.internalError();
    }
  }

  badRequest(res, view, data) {
    return res.status(400).render(view, data);
  }

  successRequest(res, view, data) {
    return res.status(200).render(view, data);
  }

  redirectResponse(res, path) {
    return res.redirect(path);
  }

  internalError(res, error) {
    logger.log({
      level: 'error',
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).render('server-error');
  }
}

module.exports = { BaseController };
