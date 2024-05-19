const { login } = require("../controller/user");
const { successModel, errorModel } = require("../model/resmodel");
const handleUserRouter = (req, resp) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  //login
  if (method === "POST" && path === "/api/user/login") {
    const { username, password } = req.body;
    const loginFlag = login(username, password);
    if (loginFlag) {
      return new successModel(loginFlag);
    }
    return new errorModel("Invalid username or password");
  }
};
module.exports = handleUserRouter;
