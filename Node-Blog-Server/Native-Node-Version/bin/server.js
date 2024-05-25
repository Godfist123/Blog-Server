const http = require("http");
const serverHandler = require("../app");

const server = http.createServer(serverHandler);
server.listen(8000);
