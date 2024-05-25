const fs = require("fs");
const path = require("path");
const readline = require("readline");

const fullFileName = path.join(__dirname, "../", "../", "logs", "access.log");

//create read stream
const readStream = fs.createReadStream(fullFileName);

//create readline instance
const readLine = readline.createInterface({
  input: readStream,
});

let chromeNum = 0;
let sum = 0;

readLine.on("line", (data) => {
  if (!data) {
    return;
  }
  sum++;
  const arr = data.split(" -- ");
  if (arr[2] && arr[2].includes("Chrome")) {
    chromeNum++;
  }
});

readLine.on("close", () => {
  console.log(chromeNum, sum);
  console.log("percentage of Chrome users : ", chromeNum / sum);
});
