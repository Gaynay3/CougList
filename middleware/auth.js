module.exports = function requireLogin(req, res, next) {
  if (!req.session.userId) {
    // User not logged in, redirect to login page
    return res.redirect('/login.html');
  }
  // User is logged in, proceed to requested page
  next();
};