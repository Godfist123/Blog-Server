const router = require("koa-router")();
const { login } = require("../controller/user");
const { successModel, errorModel } = require("../model/resmodel");
router.prefix("/api/user");

router.post("/login", async function (ctx, next) {
  const { username, password } = ctx.request.body;
  try {
    const loginData = await login(username, password);
    if (loginData.username) {
      console.log(
        "Setting session data:",
        loginData.username,
        loginData.realname
      );

      // Set session data
      ctx.session.username = loginData.username;
      ctx.session.realname = loginData.realname;

      ctx.body = new successModel("Login successful");
      return;
    }
    ctx.body = new errorModel("Invalid username or password");
  } catch (error) {
    console.error("Login process error:", error);
    ctx.status = 500;
    ctx.body = new errorModel("Internal server error");
  }
});

router.get("/session-test", async (ctx, next) => {
  if (ctx.session.view == null) {
    ctx.session.view = 0;
  }
  ctx.session.view++;
  ctx.body = {
    errno: 0,
    viewtimes: ctx.session.view,
  };
});

module.exports = router;
