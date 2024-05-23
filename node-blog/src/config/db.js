const env = process.env.NODE_ENV;
let MYSQL_CONFIG;

if (env === "development") {
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "rphqgmebrF1",
    port: "3306",
    database: "blog",
  };
}
if (env === "production") {
  MYSQL_CONFIG = {
    Host: "localhost",
    user: "root",
    password: "rphqgmebrF1",
    port: "3306",
    database: "blog",
  };
}

module.exports = {
  MYSQL_CONFIG,
};
