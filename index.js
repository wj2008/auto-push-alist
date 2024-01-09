const path = require("path");
const fs = require("fs");
const axios = require("axios");
const core = require("@actions/core");
let filepaths = [];

// 接收输入参数
const username = core.getInput("username");
const password = core.getInput("password");
const upUrl = core.getInput("upUrl");
const saveDir = core.getInput("saveDir");
const upDir = core.getInput("upDir");

async function getToken() { 
  try {
    let resp = await axios.post(`${upUrl}/api/auth/login`, { username, password });
    return resp.data.data.token;
  } catch (error) {
  }
  return null;
}

async function upAlist(token, filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    const size = fileStats.size;
    const enpath = encodeURIComponent(`${saveDir}/${fileName}`);
    const fileData = fs.readFileSync(filePath);
    let resp = await axios.put(`${upUrl}/api/fs/put`, fileData, { headers: { 'Authorization': token, 'File-Path': enpath, 'Content-Type': 'application/octet-stream', 'Content-Length': size } });
    console.log(filePath, ' -> ', resp.data.message);
  } catch (error) {
    console.error(filePath, ' -> Error upAlist :', error.message);
  }
}

async function refresh(token) {
  try {
    let resp = await axios.post(`${upUrl}/api/fs/list`, { path: saveDir, refresh: true }, { headers: { 'Authorization': token, 'Content-Type': 'application/json' } });
    console.log('refresh -> ', resp.data.message);
  } catch (error) {
    console.error('refresh error ', error.message);
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
    let token = await getToken();
    if (!token) { 
      return console.log('token is null, plz check your url');
    }
    readFileSync(upDir);
    for await (file of filepaths) {
      await upAlist(token, file);
    }
    await refresh(token);
  } catch (e) {
    console.log(e);
  }
}
// 上传发布
update();
