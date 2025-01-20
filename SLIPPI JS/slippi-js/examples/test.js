const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8765');

ws.on('open', function open() {
    // Send data to Python server
    const data = {
      opp_character: 'FOX',
      stage: 'IZUMI'
    };
    ws.send(JSON.stringify(data));
  });

ws.on('message', function message(data) {
  console.log('Received:', data);
});

ws.on('error', function error(error) {
  console.error('WebSocket error:', error);
});

ws.on('close', function close() {
  console.log('WebSocket connection closed');
});
