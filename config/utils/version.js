const child_process = require('child_process');

// git 最后一次提交的 Head
const commit = child_process
    .execSync('git show -s --format=%H')
    .toString()
    .trim();
const commitUserName = child_process
    .execSync('git show -s --format=%cn')
    .toString()
    .trim();
const commitUserMail = child_process
    .execSync('git show -s --format=%ce')
    .toString()
    .trim();
const commitDateObj = new Date(child_process.execSync(`git show -s --format=%cd`).toString());
const commitDate = `${commitDateObj.getFullYear() +
    '-' +
    (commitDateObj.getMonth() + 1) +
    '-' +
    commitDateObj.getDate() +
    ' ' +
    commitDateObj.getHours() +
    ':' +
    commitDateObj.getMinutes()}`;
const buildUserName = child_process
    .execSync('git config user.name')
    .toString()
    .trim();
const buildTag = child_process
    .execSync(`git log -1 --decorate=short --oneline|grep -Eo 'tag: (.*)[,)]+'|awk '{print $2}'|sed 's/)//g'|sed 's/,//g'`)
    .toString()
    .trim();
const buildUserMail = child_process
    .execSync('git config user.email')
    .toString()
    .trim();
const nowDate = new Date();
const buildDate = `${nowDate.getFullYear() +
    '-' +
    (nowDate.getMonth() + 1) +
    '-' +
    nowDate.getDate() +
    ' ' +
    nowDate.getHours() +
    ':' +
    nowDate.getMinutes()}`;

module.exports = { commit, buildTag, commitUserName, commitUserMail, commitDate, buildUserName, buildUserMail, buildDate };