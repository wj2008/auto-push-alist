const path = require("path");
const fs = require("fs");
const axios = require("axios");
const core = require("@actions/core");
let filepaths = [];

// 接收输入参数
const token = core.getInput("token");
const upUrl = core.getInput("upUrl");
const saveDir = core.getInput("saveDir");
const upDir = core.getInput("upDir");
const upFile = core.getInput("upFile");
const asTaskInput = core.getInput("asTask");
let asTask = false;
if (asTaskInput.toLowerCase() === "true") {
  asTask = true;
} 

async function upAlist(filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    const enpath = encodeURIComponent(`${saveDir}/${upDir ? filePath : fileName}`);
    let resp = await axios.put(`${upUrl}/api/fs/put`, fs.readFileSync(filePath), { headers: { 'Authorization': token, 'As-Task': asTask, 'File-Path': enpath, 'Content-Type': 'application/octet-stream', 'Content-Length': fileStats.size } });
    console.log(filePath, ' -> ', resp.data.message);
  } catch (error) {
    console.error(filePath, ' -> Error upAlist');
  }
}

async function refresh(token) {
  try {
    let resp = await axios.post(`${upUrl}/api/fs/list`, { path: saveDir, refresh: true }, { headers: { 'Authorization': token, 'Content-Type': 'application/json' } });
    console.log('refresh -> ', resp.data.message);
  } catch (error) {
    console.error('refresh error ');
  }
}

function readFileSync(filepath) {
  let files = fs.readdirSync(filepath);
  files.forEach((filename) => {
    let p = path.join(filepath, filename);
    let stats = fs.statSync(p);
    if (stats.isFile()) {
      filepaths.push(p);
    } else if (stats.isDirectory()) {
      readFileSync(p);
    }
  });
}

async function update() {
  try {
    if (upFile) filepaths.push(upFile);
    if (upDir) readFileSync(upDir);
    for await (file of filepaths) {
      await upAlist(file);
    }
    await refresh(token);
  } catch (e) {
    console.log(e);
  }
}
// 上传发布
update();
