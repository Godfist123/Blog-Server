const { login } = require("../controller/user");
const { successModel, errorModel } = require("../model/resmodel");
const handleUserRouter = (req, resp) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    return d.toGMTString();
  };

  //login
  if (method === "GET" && path === "/api/user/login") {
    // const { username, password } = req.body;
    const { username, password } = req.query;
    const loginResult = login(username, password);
    return loginResult.then((data) => {
      if (data.username) {
        req.session.username = data.username;
        req.session.realname = data.realname;
        return new successModel();
      }
      return new errorModel("Invalid username or password");
    });
  }

  //login check
  if (method === "GET" && path === "/api/user/loginCheck") {
    if (req.session.username) {
      return Promise.resolve(
        new successModel({ username: req.session.username })
      );
    }
    return Promise.resolve(new errorModel("Login First !"));
  }
};
module.exports = handleUserRouter;
