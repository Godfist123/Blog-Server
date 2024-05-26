const { successModel, errorModel } = require("../model/resmodel");

module.exports = (req, res, next) => {
  console.log("name", req.session.username);
  if (req.query.isadmin) {
    if (req.session.username) {
      req.body.author = req.session.username;
      next();
      return;
    }
    res.json(new errorModel("login Failed"));
  } else {
    req.body.author = req.session.username;
    next();
  }
};
