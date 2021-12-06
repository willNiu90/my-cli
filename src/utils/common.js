import ora from 'ora';
import axios from 'axios';
import { promisify } from 'util';
import { resolve, join } from 'path';
import downloadGit from 'download-git-repo';
import fs from 'fs';
import ncp from 'ncp';
import metalSmith from 'metalSmith';

let npcPromise = promisify(ncp);
let downloadGitTemp = promisify(downloadGit); // 将项目下载到当前用户的临时文件夹下

const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/my-cli-temp`;
console.log('-----downloadDirectory-----', downloadDirectory);
export const downDir = async repo => {
  console.log(repo, 'downDir方法');
  let project = `willNiu90/${repo}`; // 下载的项目

  let dest = `${downloadDirectory}/${repo}`;
  // 把项目下载当对应的目录中
  console.log(dest, 'dest的内容。。。。。。。。。。');
  console.log(project, 'dest的内容。。。。。。。。。。');
  try {
    await downloadGitTemp(project, dest);
  } catch (error) {
    console.log('错误了吗？？？\n');
    console.log(error);
  }
  return dest;
};

export const fnLoadingByOra =
  (fn, message) =>
    async (...argv) => {
      const spinner = ora(message);
      spinner.start();
      let result = await fn(...argv);
      spinner.succeed();
      return result;
    };

export const getTagLists = async repo => {
  const { data } = await axios.get('https://api.github.com/repos/lxy-cli//tags');
  return data;
};

export const copyTempToLocalhost = async (target, projectName) => {
  const resolvePath = join(resolve(), projectName);
  if (!fs.existsSync(join(target, 'ask.js'))) {
    await ncp(target, resolvePath);
    // fs.remove(target);
  } else {
    await new Promise((resolve, reject) => {});
  }
};

export const mapActions = {
  create: {
    alias: 'c', // 别名
    description: '创建一个项目', // 描述
    examples: ['my-cli create <project-name>'],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: ['my-cli config set <k> <v>', 'my-cli config get <k>'],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};
