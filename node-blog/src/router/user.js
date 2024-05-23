const { login } = require("../controller/user");
const { get, set } = require("../db/redis");
const { successModel, errorModel } = require("../model/resmodel");
const handleUserRouter = (req, resp) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  //login
  if (method === "GET" && path === "/api/user/login") {
    const { username, password } = req.query;
    const loginResult = login(username, password);
    return loginResult.then((data) => {
      if (data.username) {
        req.session.username = data.username;
        req.session.realname = data.realname;
        set(req.sessionId, req.session);
        return new successModel();
      }
      return new errorModel("Invalid username or password");
    });
  }

  //login check
  if (method === "GET" && path === "/api/user/loginCheck") {
    try {
      if (req.session.username) {
        return Promise.resolve(
          new successModel({ username: req.session.username })
        );
      }
    } catch (error) {
      return Promise.reject(new errorModel("Login First !"));
    }
  }
};
module.exports = handleUserRouter;
