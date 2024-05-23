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
    const result = getList(author, keyword);
    return result.then((listData) => {
      return new successModel(listData);
    });
  }

  //Get blog detail
  if (method === "GET" && path === "/api/blog/detail") {
    const result = getDetail(id);
    return result.then((blogDetail) => {
      return new successModel(blogDetail);
    });
  }

  //write a new blog
  if (method === "POST" && path === "/api/blog/new") {
    const author = "val";
    req.body.author = author;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new successModel(data);
    });
  }

  //update a blog
  if (method === "POST" && path === "/api/blog/update") {
    const updateResult = updateBlog(id, req.body);
    return updateResult.then((updateFlag) => {
      console.log(updateFlag);
      if (updateFlag) {
        return new successModel("Update Successful");
      }
      return new errorModel("Update Failed");
    });
  }

  //delete a blog
  if (method === "POST" && path === "/api/blog/delete") {
    const author = "val";
    const deleteResult = deleteBlog(id, author);
    return deleteResult.then((deleteFlag) => {
      if (deleteFlag) {
        return new successModel("Delete Successful");
      }
      return new errorModel("Delete Failed");
    });
  }
};

module.exports = handleBlogRouter;
