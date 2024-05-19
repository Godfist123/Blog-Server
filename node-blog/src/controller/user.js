const login = (username, password) => {
  if (username === "val" && password === "123") {
    return true;
  }
  return false;
};

module.exports = { login };
