const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const queryString = require("querystring");
const { get, set } = require("./src/db/redis");
const { access } = require("./src/utils/log");

//session data
// let SESSION_DATA = {};
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
  access(
    `${req.method} -- ${req.url} -- ${req.headers["user-agent"]} -- ${Date.now()}`
  );
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
  // let sessionFlag = false;
  // let userId = req.cookie.userid;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   sessionFlag = true;
  //   userId = `${Date.now()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // req.session = SESSION_DATA[userId];

  //set session when no userid
  let sessionFlag = false;
  let userId = req.cookie.userid;
  if (!userId) {
    sessionFlag = true;
    userId = `${Date.now()}_${Math.random()}`;
    set(userId, {});
  }
  //get session
  req.sessionId = userId;
  get(userId)
    .then((sessionData) => {
      if (sessionData == null) {
        set(req.sessionId, {});
        req.session = {};
      } else {
        req.session = sessionData;
      }
      return getPostData(req);
    })

    //add postData to req object
    .then((postData) => {
      req.body = postData;

      //handle blog router
      const blogPromise = handleBlogRouter(req, resp);
      if (blogPromise) {
        if (sessionFlag) {
          resp.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        blogPromise.then((blogData) => {
          resp.end(JSON.stringify(blogData));
        });
        return;
      }

      //handle user router
      const userResult = handleUserRouter(req, resp);
      if (userResult) {
        if (sessionFlag) {
          resp.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        userResult.then((data) => {
          resp.end(JSON.stringify(data));
        });
        return;
      }

      resp.writeHead(404, { "Content-type": "text/plain" });
      resp.write("404 NOT FOUND\n");
      resp.end();
    });
};
module.exports = serverHandler;
