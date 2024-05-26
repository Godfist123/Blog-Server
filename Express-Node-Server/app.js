var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const blogRouter = require("./routes/blog");
const userRouter = require("./routes/users");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

var app = express();
const redisClient = require("./db/redis");
const sessionStore = new RedisStore({
  client: redisClient,
});
app.use(
  session({
    secret: "q2ds_^",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.get("/set", (req, res) => {
//   const k = redisClient.get("test123", (err, data) => {
//     if (err) {
//       redisClient.set("test123", "taaaa");
//       res.send("fail");
//       return;
//     }
//     res.send(`${data}`);
//   });
// });

app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
