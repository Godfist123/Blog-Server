const router = require("koa-router")();

router.prefix("/api/user");

router.post("/login", async function (ctx, next) {
  const { username, password } = ctx.request.body;
  ctx.body = {
    errno: 0,
    username,
    password,
  };
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
