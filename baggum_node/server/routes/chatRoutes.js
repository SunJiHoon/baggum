const express = require('express');
const router = express.Router();
const http = require('http'); // <-- http 모듈을 불러옵니다.
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');

// 방 생성 라우트
router.post('/create-room', (req, res) => {
  const roomId = Math.random().toString(36).substr(2, 9);
  res.status(200).json({ roomId });
});

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (message) => {
      io.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return router;
}

//module.exports = router;