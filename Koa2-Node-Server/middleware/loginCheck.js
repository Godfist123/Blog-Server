const { successModel, errorModel } = require("../model/resmodel");

module.exports = async (ctx, next) => {
  console.log("name", ctx.session.username);
  if (ctx.query.isadmin) {
    if (ctx.session.username) {
      ctx.request.body.author = ctx.session.username;
      await next();
      return;
    }
    ctx.body = new errorModel("login Failed");
  } else {
    ctx.request.body.author = ctx.session.username;
    await next();
  }
};
