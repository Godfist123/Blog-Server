const env = process.env.NODE_ENV;
let MYSQL_CONFIG;
let REDIS_CONFIG;

if (env === "development") {
  MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "rphqgmebrF1",
    port: "3306",
    database: "blog",
  };

  REDIS_CONFIG = {
    port: 6379,
    host: "localhost",
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

  REDIS_CONFIG = {
    port: 6379,
    host: "localhost",
  };
}

module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG,
};
