const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000;
let dataInterval;
let verticalOffset = 0;
let noise = 1;
let sampleTime = 500;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let count = 0;
  // dataInterval = setInterval(() => {
  //   socket.emit('new data', {timeStamp: moment(), value: (Math.random() * noise) + verticalOffset});
  // }, sampleTime);

  createDataSample = () => {
    socket.emit('new data', {timeStamp: moment(), value: (Math.random() * noise) + verticalOffset}); 
    setTimeout(createDataSample, sampleTime)
  }

  dataInterval = setTimeout(createDataSample, sampleTime);

  socket.on('disconnect', (reason) => {
    console.log('user disconnected');
    clearInterval(dataInterval);
  });

  socket.on('vertical offset', (msg) => {
    console.log('msg: ', msg);
    verticalOffset = msg; 
  });

  socket.on('noise', (msg) => {
    console.log('noise: ', msg);
    noise = msg; 
  });

  socket.on('sample time', (msg) => {
    console.log('sample time: ', msg);
    sampleTime = msg; 
  });

});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});