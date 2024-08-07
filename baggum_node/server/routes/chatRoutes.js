const express = require('express');
const router = express.Router();
const http = require('http'); // <-- http 모듈을 불러옵니다.
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const UserRoomMapping = require('../models/userRoomMapping');

// 방 생성 라우트
router.post('/create-room', (req, res) => {
  const roomId = Math.random().toString(36).substr(2, 9);
  res.status(200).json({ roomId });
});

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
  
    // 사용자 특정 방에 참여
    socket.on('joinRoom', async ({ userId, roomId }) => {
      try {
        await UserRoomMapping.create({ userId, roomId });

        socket.join(roomId);
        console.log(`${userId} joined room ${roomId}`);
      } catch (error) {
        console.error('Error adding user to room: ', error);
      }
    });
  
    // 방으로 메시지 보내기
    socket.on('message', ({ roomId, message }) => {
      io.to(roomId).emit('message', message);
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return router;
}

//module.exports = router;