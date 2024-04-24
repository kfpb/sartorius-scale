const net = require('net');

const moxaHost = '192.168.127.254';
const moxaPort = 4001;
const client = new net.Socket();

client.connect(moxaPort, moxaHost, () => {
  console.log('Terhubung ke Moxa');
});
 
function requestScaleData() {
  const command = 'WI\r';
  client.write(command);
  setTimeout(requestScaleData, 1000);
}

module.exports = {
  moxaHost,
  requestScaleData,
  ...client
};