var express = require("express");
const { login } = require("../controller/user");
var router = express.Router();
const { successModel, errorModel } = require("../model/resmodel");
const redisClient = require("../db/redis");
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  const loginResult = login(username, password);
  return loginResult
    .then((data) => {
      if (data.username) {
        console.log("Setting session data:", data.username, data.realname);

        // Set session data
        console.log(data.username);
        req.session.username = data.username;
        req.session.realname = data.realname;
        // Explicitly save the session before sending the response
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            // Check if headers have already been sent
            if (res.headersSent) {
              console.error("Headers already sent.");
              return;
            }
            res.status(500).json(new errorModel("Failed to save session data"));
          } else {
            res.json(new successModel());
          }
        });
        return;
      }
      // Check if headers have already been sent
      if (res.headersSent) {
        console.error("Headers already sent.");
        return;
      }
      res.json(new errorModel("Invalid username or password"));
    })
    .catch((error) => {
      console.error("Login process error:", error);
      if (res.headersSent) {
        console.error("Headers already sent.");
        return;
      }
      res.status(500).json(new errorModel("Internal server error"));
    });
});

module.exports = router;
