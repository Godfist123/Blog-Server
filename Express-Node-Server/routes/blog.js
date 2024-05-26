const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { successModel, errorModel } = require("../model/resmodel");

const express = require("express");
const router = express.Router();

router.get("/list", (req, resp, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  // if (req.query.admin) {
  //   const loginCheckResult = loginCheck(req);
  //   if (loginCheckResult) {
  //     return loginCheckResult;
  //   }
  //   author = req.session.username;
  // }

  const result = getList(author, keyword);
  return result.then((listData) => {
    resp.json(new successModel(listData));
  });
});
router.get("/detail", (req, resp, next) => {
  resp.json({
    errno: 0,
    data: "ok",
  });
});

module.exports = router;
