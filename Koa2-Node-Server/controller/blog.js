const { execSql, escape } = require("../db/mysql.js");
const xss = require("xss");

const getList = async (author, keyword) => {
  if (author) author = escape(xss(author));
  if (keyword) keyword = escape(xss("%" + keyword + "%"));

  let sql = `select * from blogs where 1=1 `;
  if (author) sql += `and author=${author} `;
  if (keyword) sql += `and title like ${keyword} `;
  sql += "order by createtime desc";

  return await execSql(sql);
};

const getDetail = async (id) => {
  id = escape(xss(id));
  const sql = `select * from blogs where id=${id}`;
  return await execSql(sql).then((data) => data[0] || {});
};

const newBlog = async (blogData = {}) => {
  // Sanitize data before inserting into database
  const title = escape(xss(blogData.title));
  const content = escape(xss(blogData.content));
  const author = escape(xss(blogData.author));
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author) values (${title}, ${content}, '${createTime}', ${author})
  `;
  const data = await execSql(sql);
  return {
    id: data.insertId,
  };
};

const updateBlog = async (id, blogData = {}) => {
  // Sanitize data before updating database
  const title = escape(xss(blogData.title));
  const content = escape(xss(blogData.content));
  id = escape(xss(id));

  const sql = `update blogs set title=${title}, content=${content} where id=${id}`;
  const updateData = await execSql(sql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
};

const deleteBlog = async (id, author) => {
  id = escape(xss(id));
  author = escape(xss(author));
  const sql = `delete from blogs where id=${id} and author=${author}`;
  const deleteData = await execSql(sql);
  if (deleteData.affectedRows > 0) {
    return true;
  }
  return false;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
