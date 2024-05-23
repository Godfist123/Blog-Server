const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const queryString = require("querystring");
const { get, set } = require("./src/db/redis");

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

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

  //get cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  //get Session
  let sessionFlag = !req.cookie.userid;
  let userId = req.cookie.userid
    ? req.cookie.userid.toString()
    : Date.now().toString();
  console
    .log(
      "sessionFlag",
      sessionFlag
    )(sessionFlag ? set(userId, {}) : Promise.resolve())
    .then(() => {
      console.log("111");

      return get(userId).then((res) => {
        resp.end(res);
      });
    })
    .then((val) => {
      console.log("222");
      const currentUser = val || {};
      req.sessionId = userId;
      req.session = currentUser;

      if (sessionFlag) {
        resp.setHeader(
          "Set-Cookie",
          `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
        );
      }

      return getPostData(req);
    })
    .then((postData) => {
      req.body = postData;
      return handleBlogRouter(req, resp) || handleUserRouter(req, resp);
    })
    .then((blogData) => {
      if (blogData) {
        resp.end(JSON.stringify(blogData));
      } else {
        resp.writeHead(404, { "Content-type": "text/plain" });
        resp.end("404 NOT FOUND\n");
      }
    })
    .catch((err) => {
      console.error("Server Error:", err);
      resp.writeHead(500);
      resp.end(JSON.stringify({ error: "Internal server error" }));
    });
};
module.exports = serverHandler;
