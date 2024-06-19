const net = require('net');
const EventEmitter = require('events');

class MoxaClient extends EventEmitter {
  constructor() {
    super();
    this.client = new net.Socket();
    this.moxaHost = '192.168.127.254';
    this.moxaPort = 4001;

    this.client.connect(this.moxaPort, this.moxaHost, () => {
      console.log('Terhubung ke Moxa');
      this.emit('connected');
    });

    this.client.on('data', (data) => {
      this.emit('data', data);
    });

    this.client.on('error', (error) => {
      console.error('Terjadi kesalahan:', error);
      this.emit('error', error);
    });

    this.client.on('close', (hadError) => {
      if (hadError) {
        console.log('Gagal terhubung ke Moxa');
      } else {
        console.log('Koneksi ke Moxa ditutup');
      }
      this.emit('close', hadError);
    });
  }

  requestScaleData() {
    const command = 'WI\r';
    this.client.write(command);
    setTimeout(() => this.requestScaleData(), 1000);
  }
}

module.exports = new MoxaClient();