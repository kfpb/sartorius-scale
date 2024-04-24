const express = require('express');
const sse = require('express-sse');
const moxaClient = require('./moxaClient');

const app = express();
const scaleDataStream = new sse();
const scaleDataArray = [];

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

moxaClient.on('data', (data) => {
  const dataString = data.toString();
  const endIndex = dataString.indexOf('\r\n');
  if (endIndex !== -1) {
    const response = dataString.substring(0, endIndex);
    console.log('Data Timbangan:', response);
    const encodedData = Buffer.from(response).toString('base64');
    const scaleData = { data: encodedData, ip: moxaClient.moxaHost };
    scaleDataArray.push(scaleData);
    scaleDataStream.send(scaleData);
  }
});

app.get('/api/scale-data', scaleDataStream.init);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
  moxaClient.requestScaleData();
});