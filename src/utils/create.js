import inquirer from 'inquirer';
import axios from 'axios';
import { fnLoadingByOra, downDir, copyTempToLocalhost } from './common.js';

export default async name => {
  const { data } = await fnLoadingByOra(
    () => axios('https://api.github.com/users/willNIu90/repos'),
    '正在链接仓库...'
  )();
  const repos = data.map(i => i.name);
  console.log(repos);
  console.log(`此处是文件${name}`);

  const { repo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'repo',
      message: '请选择一个你要创建的项目',
      choices: repos,
    },
  ]);
  console.log(`我现在选择了那个仓库？ ${repo}`);
  const target = await fnLoadingByOra(downDir, '下载中....')(repo);
  await copyTempToLocalhost(target, name);
};
