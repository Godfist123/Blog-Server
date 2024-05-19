const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { successModel, errorModel } = require("../model/resmodel");

const handleBlogRouter = (req, resp) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];
  const id = req.query.id || "";

  //Get blog list
  if (method === "GET" && path === "/api/blog/list") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    const listData = getList(author, keyword);
    return new successModel(listData);
  }

  //Get blog detail
  if (method === "GET" && path === "/api/blog/detail") {
    const detail = getDetail(id);
    return new successModel(detail);
  }

  //write a new blog
  if (method === "POST" && path === "/api/blog/new") {
    const data = newBlog(req.body);
    return new successModel(data);
  }

  //update a blog
  if (method === "POST" && path === "/api/blog/update") {
    const updateFlag = updateBlog(id, req.body);
    if (updateFlag) {
      return new successModel("Update Successful");
    } else {
      return new errorModel("Update Failed");
    }
  }

  //delete a blog
  if (method === "POST" && path === "/api/blog/delete") {
    const deleteFlag = deleteBlog(id);
    if (deleteFlag) {
      return new successModel("Delete Successful");
    }
    return new errorModel("Delete Failed");
  }
};

module.exports = handleBlogRouter;
