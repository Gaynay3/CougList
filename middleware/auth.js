module.exports = function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login.html');  // redirect if not logged in
  }
};

