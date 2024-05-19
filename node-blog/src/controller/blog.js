const getList = (author, keyword) => {
  return [
    {
      id: 1,
      title: "title A",
      content: "content A",
      createTime: 1716028363876,
      author: "Jack",
    },
    {
      id: 2,
      title: "title B",
      content: "content B",
      createTime: 1716028363877,
      author: "Rose",
    },
    {
      id: 3,
      title: "title C",
      content: "content C",
      createTime: 1716028363878,
      author: "Tom",
    },
  ];
};

const getDetail = (id) => {
  return [
    {
      id: 1,
      title: "title A",
      content: "content A",
      createTime: 1716028363876,
      author: "Jack",
    },
  ];
};

const newBlog = (blogData = {}) => {
  console.log("blogdata", blogData);
  return {
    id: 3,
  };
};

const updateBlog = (id, blogData = {}) => {
  return true;
};

const deleteBlog = (id) => {
  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
