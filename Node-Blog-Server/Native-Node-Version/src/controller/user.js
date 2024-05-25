const { execSql, escape } = require("../db/mysql");
const xss = require("xss");

const login = (username, password) => {
  // Escape username to prevent SQL Injection
  const escapedUsername = escape(username);

  // Sanitize username to prevent XSS attacks when username might be used in subsequent client-side rendering
  const safeUsername = xss(escapedUsername);

  const sql = `
select username, realname from users where username=${safeUsername}
`;
  return execSql(sql).then((data) => {
    if (data.length > 0) {
      const user = data[0];
      // Sanitize output to prevent XSS when data might be used in client-side rendering
      user.username = xss(user.username);
      user.realname = xss(user.realname);
      return user;
    }
    return {};
  });
};

module.exports = { login };

//using bcrypt
// const { execSql, escape } = require("../db/mysql");
// const xss = require("xss");
// const bcrypt = require("bcryptjs");

// const login = (username, password) => {
//   // Escape username to prevent SQL Injection
//   const escapedUsername = escape(username);

//   // Sanitize username to prevent XSS attacks when username might be used in subsequent client-side rendering
//   const safeUsername = xss(escapedUsername);

//   const sql = `
// select username, realname, password from users where username=${safeUsername}
// `;
//   return execSql(sql).then((data) => {
//     if (data.length > 0) {
//       const user = data[0];
//       // Use bcrypt to compare the provided password with the hashed password stored in the database
//       return bcrypt.compare(password, user.password).then(isValid => {
//         if (isValid) {
//           // Sanitize output to prevent XSS when data might be used in client-side rendering
//           user.username = xss(user.username);
//           user.realname = xss(user.realname);
//           // Return user data without the password field
//           return { username: user.username, realname: user.realname };
//         } else {
//           return {}; // Password is incorrect
//         }
//       });
//     }
//     return {}; // User not found
//   });
// };

// module.exports = { login };
