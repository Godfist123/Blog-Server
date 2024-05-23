const { execSql } = require("../db/mysql.js");

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}'% `;
  }
  sql += "order by createtime desc";
  return execSql(sql);
};

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return execSql(sql).then((data) => {
    return data[0];
  });
};

const newBlog = (blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();

  const sql = `
  insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createTime}','${author}')
  `;

  return execSql(sql).then((data) => {
    return data.insertId;
  });
};

const updateBlog = (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;

  const sql = `update blogs set title='${title}', content='${content}' where id = '${id}'`;
  return execSql(sql).then((updateData) => {
    if (updateBlog.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const deleteBlog = (id, author) => {
  const sql = ` delete from blogs where id='${id}' and author='${author}'
  `;
  return execSql(sql).then((deleteData) => {
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
