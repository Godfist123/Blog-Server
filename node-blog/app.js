const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const queryString = require("querystring");

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      } else {
        resolve(JSON.parse(postData));
      }
    });
  });
};

const serverHandler = (req, resp) => {
  resp.setHeader("Content-type", "application/json");

  //add query to req obj
  const url = req.url;
  req.query = queryString.parse(url.split("?")[1]);

  //add postData to req object
  getPostData(req).then((postData) => {
    req.body = postData;

    //handle blog router
    const blogData = handleBlogRouter(req, resp);
    if (blogData) {
      resp.end(JSON.stringify(blogData));
      return;
    }

    //handle user router
    const userData = handleUserRouter(req, resp);
    if (userData) {
      resp.end(JSON.stringify(userData));
      return;
    }

    resp.writeHead(404, { "Content-type": "text/plain" });
    resp.write("404 NOT FOUND\n");
    resp.end();
  });
};
module.exports = serverHandler;
