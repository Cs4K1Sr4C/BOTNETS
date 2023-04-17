const request = require('request');
const readline = require('readline');
const fs = require('fs');

const CANDC_URL = 'http://localhost:3000';

// Command-line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const executeCommand = (command) => {
  request.post(`${CANDC_URL}/command`, {
    json: { command }
  }, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log(body);
    }
  });
};

rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');
  switch (command) {
    case 'exec':
      executeCommand(args.join(' '));
      break;
    case 'upload':
      if (args.length !== 1) {
        console.error('Invalid number of arguments!');
      } else {
        const filePath = args[0];
        if (!fs.existsSync(filePath)) {
          console.error('File not found!');
        } else {
            const fileStream = fs.createReadStream(filePath);
            const fileName = filePath.split('/').pop();
            const formData = { file: { value: fileStream, options: { filename: fileName } } };
            request.post({ url: `${CANDC_URL}/upload`, formData: formData }, (error, response, body) => {
              if (error) {
                console.error(error);
              } else {
                console.log(body);
              }
            });
          }
        }
        break;
      default:
        console.error(`Invalid command: ${command}`);
        break;
    }
  });
  
  