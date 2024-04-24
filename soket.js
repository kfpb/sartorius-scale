const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const net = require('net');

// Konfigurasi koneksi ke Moxa
const moxaHost = '192.168.127.254'; // Ganti dengan alamat IP Moxa Anda
const moxaPort = 4001; // Ganti dengan port yang digunakan Moxa

// Buat koneksi socket ke Moxa
const client = new net.Socket();
client.connect(moxaPort, moxaHost, () => {
  console.log('Terhubung ke Moxa');
});

// Variabel untuk menyimpan data timbangan
let scaleData = '';

// Fungsi untuk meminta data dari timbangan
function requestScaleData() {
  const command = 'W\r'; // Perintah "W" untuk membaca berat stabil dalam protokol SBI
  client.write(command);
}

// Terima data dari Moxa dan proses
client.on('data', (data) => {
  const dataString = data.toString();
  scaleData += dataString;

  // Cari akhir balasan dari timbangan (sesuaikan jika format berbeda)
  const endIndex = scaleData.indexOf('\r\n');
  if (endIndex !== -1) {
    const response = scaleData.substring(0, endIndex);
    scaleData = scaleData.substring(endIndex + 2); // Hapus data yang sudah diproses

    // Kirim data timbangan melalui WebSocket
    io.emit('scaleData', response);

    // Minta data baru setelah 1 detik
    setTimeout(requestScaleData, 1000);
  }
});

// Endpoint untuk menyajikan file HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Jalankan server pada port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  requestScaleData(); // Minta data timbangan pertama kali
});

// Menangani koneksi WebSocket
io.on('connection', (socket) => {
  console.log('Klien WebSocket terhubung');
});