const { execSql, escape } = require("../db/mysql.js");
const xss = require("xss");

const getList = (author, keyword) => {
  if (author) author = escape(xss(author));
  if (keyword) keyword = escape(xss("%" + keyword + "%"));

  let sql = `select * from blogs where 1=1 `;
  if (author) sql += `and author=${author} `;
  if (keyword) sql += `and title like ${keyword} `;
  sql += "order by createtime desc";

  return execSql(sql);
};

const getDetail = (id) => {
  id = escape(xss(id));
  const sql = `select * from blogs where id=${id}`;
  return execSql(sql).then((data) => data[0] || {});
};

const newBlog = (blogData = {}) => {
  // Sanitize data before inserting into database
  const title = escape(xss(blogData.title));
  const content = escape(xss(blogData.content));
  const author = escape(xss(blogData.author));
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author) values (${title}, ${content}, '${createTime}', ${author})
  `;
  return execSql(sql).then((data) => data.insertId);
};

const updateBlog = (id, blogData = {}) => {
  // Sanitize data before updating database
  const title = escape(xss(blogData.title));
  const content = escape(xss(blogData.content));
  id = escape(xss(id));

  const sql = `update blogs set title=${title}, content=${content} where id=${id}`;
  return execSql(sql).then((updateData) => updateData.affectedRows > 0);
};

const deleteBlog = (id, author) => {
  id = escape(xss(id));
  author = escape(xss(author));
  const sql = `delete from blogs where id=${id} and author=${author}`;
  return execSql(sql).then((deleteData) => deleteData.affectedRows > 0);
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
