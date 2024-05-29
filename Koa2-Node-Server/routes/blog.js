const router = require("koa-router")();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { successModel, errorModel } = require("../model/resmodel");
const loginCheck = require("../middleware/loginCheck");

router.prefix("/api/blog");

router.get("/list", loginCheck, async function (ctx, next) {
  let author = ctx.request.body.author || "";
  const keyword = ctx.query.keyword || "";

  const listData = await getList(author, keyword);
  ctx.body = new successModel(listData);
});

router.get("/detail", async function (ctx, next) {
  const detailData = await getDetail(ctx.query.id);
  ctx.body = new successModel(detailData);
});

router.post("/new", loginCheck, async function (ctx, next) {
  const data = await newBlog(ctx.request.body);
  ctx.body = new successModel(data);
});

router.post("/update", loginCheck, async function (ctx, next) {
  const updateFlag = await updateBlog(ctx.query.id, ctx.request.body);
  if (updateFlag) {
    ctx.body = new successModel();
    return;
  }
  ctx.body = new errorModel("Update Failed");
});

router.post("/delete", loginCheck, async function (ctx, next) {
  const deleteFlag = await deleteBlog(ctx.query.id, ctx.session.username);
  if (deleteFlag) {
    ctx.body = new successModel("successfully deleted");
    return;
  }
  ctx.body = new errorModel("delete failed");
});
module.exports = router;
