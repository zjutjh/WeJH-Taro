import dayjs from "dayjs";
const child_process = require("child_process");
// git 最后一次提交的 Head
const commit = child_process
  .execSync("git show -s --format=%H")
  .toString()
  .trim();
const commitDateObj = new Date(
  child_process.execSync("git show -s --format=%cd").toString()
);
const commitDate = dayjs(commitDateObj).format("YYYY-MM-DD HH:mm:ss");
const buildDate = dayjs().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
  commit,
  commitDate,
  buildDate
};
