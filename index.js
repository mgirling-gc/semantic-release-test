const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Howdy, GoCardless User!');

rl.question('What is your nickname, friend? ', (name) => {
  console.log(`Hello, human. "${name}" is my favourite name!`);
  rl.close();
});

rl.on('close', () => {
  console.log('Have a nice day!');
});