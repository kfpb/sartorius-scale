const net = require('net');
const express = require('express');
const sse = require('express-sse');
const app = express();

const moxaHost = '192.168.127.254';
const moxaPort = 4001;

const client = new net.Socket();
client.connect(moxaPort, moxaHost, () => {
  console.log('Terhubung ke Moxa');
});

const scaleDataStream = new sse(); 
const scaleDataArray = [];

function requestScaleData() {
  const command = 'WI\r'; 
  client.write(command);
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

client.on('data', (data) => {
  const dataString = data.toString();
  const endIndex = dataString.indexOf('\r\n');
  if (endIndex !== -1) {
    const response = dataString.substring(0, endIndex);

    console.log('Data Timbangan:', response);

    const encodedData = Buffer.from(response).toString('base64');
    const scaleData = { 
      data: encodedData,
      ip: moxaHost 
    };
    scaleDataArray.push(scaleData);

    scaleDataStream.send(scaleData);

    setTimeout(requestScaleData, 1000);
  }
});

app.get('/api/scale-data', scaleDataStream.init);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
  requestScaleData();
});
