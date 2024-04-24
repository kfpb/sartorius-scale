# Mini Server untuk Berkomunikasi dengan Sartorius BCA dengan menggunakan Moxa 

**Very Simple.**

Mini server ini berfungsi sebagai perantara untuk berkomunikasi dengan timbangan Sartorius BCA menggunakan perangkat Moxa. Server ini akan menyediakan API yang dapat digunakan untuk mengambil data berat dari timbangan Sartorius BCA.

## Setup

1. Pastikan Anda telah menginstal Node.js di server Anda.
2. Clone repositori ini ke server Anda.
3. Jalankan perintah `npm install` untuk menginstal semua dependensi yang diperlukan.
4. Konfigurasikan koneksi dengan perangkat Moxa dan Sartorius BCA sesuai dengan dokumentasi yang disediakan.

## Menjalankan Server

Untuk menjalankan server dengan menggunakan pilihan API yang berbeda, gunakan perintah berikut:

1. Untuk menggunakan Server-Sent Events (SSE) sebagai default:
```bash
npm start
```

2. Untuk menggunakan Websocket:
```bash
npm run start-websocket
```

3. Untuk menggunakan API biasa:
```bash
npm run start-api
