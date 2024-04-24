const net = require('net');
const express = require('express');
const app = express();

const moxaHost = '192.168.127.254'; 
const moxaPort = 4001; 


const client = new net.Socket();
client.connect(moxaPort, moxaHost, () => {
  console.log('Terhubung ke Moxa');
});

const scaleDataArray = [];

// Fungsi untuk meminta data dari timbangan
function requestScaleData() {
  const command = 'WI\r'; // Perintah "WI" untuk membaca berat stabil dalam protokol SBI
  client.write(command);
}

// Terima data dari Moxa dan proses
// client.on('data', (data) => {
//   const dataString = data.toString();
//   scaleData += dataString;
  
//   const endIndex = scaleData.indexOf('\r\n');
//   if (endIndex !== -1) {
//     const response = scaleData.substring(0, endIndex);

//     scaleData = scaleData.substring(endIndex + 2); // Hapus data yang sudah diproses

//     console.log('Data Timbangan:', response);
    
//     scaleData = response
//     // Lakukan apa yang diperlukan dengan data timbangan
    
//     // Minta data baru setelah 1 detik
//     setTimeout(requestScaleData, 1000);
//   }
// });

client.on('data', (data) => {
  const dataString = data.toString();
  const endIndex = dataString.indexOf('\r\n');
  if (endIndex !== -1) {
    const response = dataString.substring(0, endIndex);

    console.log('Data Timbangan:', response);

    const encodedData = Buffer.from(response).toString('base64');
    const encodedIp = Buffer.from(moxaHost).toString('base64');
    scaleDataArray.push({ data: encodedData, ip: encodedIp });

    setTimeout(requestScaleData, 1000);
  }
});

app.get('/api/scale-data', (req, res) => {
  res.json({ 
    data: scaleDataArray,
   });
});

const  PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
  requestScaleData();
});
