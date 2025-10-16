import dgram from 'react-native-udp';

export async function wakeLocalNetwork() {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');

    socket.once('listening', () => {
      console.log('✅ UDP socket bound.');

      // Send a dummy packet to the router (commonly 192.168.1.1)
      const message = 'hello';

      // You can replace this with your real gateway IP if needed
      socket.send(
        message,
        0,
        message.length,
        12345,
        '192.168.1.1',
        (err) => {
          if (err) {
            console.warn('UDP send error:', err);
          } else {
            console.log('✅ UDP packet sent.');
          }
           
          resolve();
        }
      );
    });

    socket.once('error', (err) => {
      console.warn('UDP error:', err);
      socket.close();
      resolve();
    });

    socket.bind(12345);
  });
}
