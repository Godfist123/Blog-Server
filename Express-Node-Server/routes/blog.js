const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { successModel, errorModel } = require("../model/resmodel");
const loginCheck = require("../middleware/loginCheck");
const express = require("express");
const router = express.Router();

router.get("/list", loginCheck, (req, resp, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  const result = getList(req.body.author, keyword);
  return result.then((listData) => {
    resp.json(new successModel(listData));
  });
});

router.get("/detail", (req, resp, next) => {
  const result = getDetail(req.query.id);
  return result.then((blogDetail) => {
    resp.json(new successModel(blogDetail));
  });
});

router.post("/new", loginCheck, (req, resp, next) => {
  console.log("new", req.body.author);
  const result = newBlog(req.body);
  return result.then((data) => {
    resp.json(new successModel(data));
  });
});

router.post("/update", loginCheck, (req, res, next) => {
  const updateResult = updateBlog(req.query.id, req.body);
  return updateResult.then((updateFlag) => {
    if (updateFlag) {
      res.json(new successModel("Update Successful"));
      return;
    }
    res.json(new errorModel("Update Failed"));
  });
});

router.post("/delete", loginCheck, (req, res, next) => {
  const deleteResult = deleteBlog(req.query.id, req.session.username);
  return deleteResult.then((deleteFlag) => {
    if (deleteFlag) {
      res.json(new successModel("successfully deleted"));
      return;
    }
    res.json(new errorModel("delete failed"));
  });
});
module.exports = router;
