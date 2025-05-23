const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello, GoCardless User!');

rl.question('What is your nickname, friend? ', (name) => {
  console.log(`Hello, ${name}!`);
  rl.close();
});