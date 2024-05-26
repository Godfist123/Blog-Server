const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { successModel, errorModel } = require("../model/resmodel");

//verify login
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new errorModel("Login First !"));
  }
};

const handleBlogRouter = (req, resp) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];
  const id = req.query.id || "";

  //Get blog list
  if (method === "GET" && path === "/api/blog/list") {
    let author = req.query.author || "";
    const keyword = req.query.keyword || "";

    if (req.query.admin) {
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        return loginCheckResult;
      }
      author = req.session.username;
    }

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
    //verify login
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new successModel(data);
    });
  }

  //update a blog
  if (method === "POST" && path === "/api/blog/update") {
    //verify login
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const updateResult = updateBlog(id, req.body);
    return updateResult.then((updateFlag) => {
      if (updateFlag) {
        return new successModel("Update Successful");
      }
      return new errorModel("Update Failed");
    });
  }

  //delete a blog
  if (method === "POST" && path === "/api/blog/delete") {
    //verify login
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const deleteResult = deleteBlog(id, req.session.username);
    return deleteResult.then((deleteFlag) => {
      if (deleteFlag) {
        return new successModel("Delete Successful");
      }
      return new errorModel("Delete Failed");
    });
  }
};

module.exports = handleBlogRouter;
