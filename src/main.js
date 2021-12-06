import program from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import { mapActions } from './utils/common.js';
import create from './utils/create.js';

const fnMap = {
  create,
};

const __dirname = path.resolve();
const res = JSON.parse(readFileSync(`${__dirname}/package.json`, 'utf8'));

Reflect.ownKeys(mapActions).forEach(action => {
  const currentAction = mapActions[action];
  program
    .command(action)
    .alias(currentAction.alias)
    .description(currentAction.description)
    .action(() => {
      if (action === '*') {
        console.log('this command not found', currentAction.description);
      } else {
        console.log('this command is', action);
        console.log(process.argv);
        fnMap[action](...process.argv.slice(3));
      }
    });
});

program.on('--help', () => {
  console.log('\nExamples:');
  Reflect.ownKeys(mapActions).forEach(action => {
    mapActions[action].examples.forEach(example => {
      console.log(example);
    });
  });
});

program.version(res.version).parse(process.argv);
