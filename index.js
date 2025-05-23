const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello, GoCardless User!');

rl.question('What is your name? ', (name) => {
  console.log(`Hello, human. "${name}" is my favourite name!`);
  rl.close();
});