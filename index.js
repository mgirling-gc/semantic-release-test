const readLine = require('readline');

console.log("Hello Universe!");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello, GoCardless User!');

rl.question('What is your name? ', (name) => {
  console.log(`Hello, ${name}!`);
  rl.close();
});