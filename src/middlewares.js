const sessionMiddleware = (req, res, next) => {
  switch (req.url) {
    case '/login':
    case '/create-account':
      if (req.session.isAuth) return res.redirect('/');
      break;
    default:
      if (!req.session.isAuth) return res.redirect('/login');
      break;
  }

  return next();
};

module.exports = { sessionMiddleware };
