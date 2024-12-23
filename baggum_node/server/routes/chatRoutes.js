const express = require('express');
const router = express.Router();
const http = require('http'); // <-- http 모듈을 불러옵니다.
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
const UserRoomMapping = require('../models/UserRoomMapping');
const Room = require('../models/Room');
const ChatHistory = require('../models/ChatHistory')
const { auth } = require('../middleware/auth');

var userId;
var realRoomId;

// 방 생성 라우트
router.post('/create-room', (req, res) => {
  const roomId = Math.random().toString(36).substr(2, 9);
  res.status(200).json({ roomId });
});

// 방을 추가하고 유저를 방에 추가하는 라우트
router.post('/admin/setChatRoom', async (req, res) => {
  const { userId1, userId2, roomName } = req.body; // roomName은 Room 모델의 name
  // console.log(userId1)
  // console.log(userId2)
  // console.log(roomName)
  userId = userId1;
  
  if (!userId1 || !userId2 || !roomName) {
    return res.status(400).json({ error: 'userId1, userId2, and roomName are required' });
  }

  try {
    // Room 테이블에 방이 이미 존재하는지 확인
    let room = await Room.findOne({ where: { name: roomName } });

    if (!room) {
      // 방이 존재하지 않으면 새로 생성
      room = await Room.create({ name: roomName });
    }

    realRoomId = room.id; // 찾은 또는 새로 생성한 방의 id

    // UserRoomMapping에 유저 추가
    await UserRoomMapping.create({ userId: userId1, roomId: realRoomId });
    await UserRoomMapping.create({ userId: userId2, roomId: realRoomId });

    res.status(201).json({ message: 'Users successfully added to the room' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/auth/chat', auth, async (req, res) => {
  // const roomId = req.query; // roomId는 Room 모델의 name을 의미
  // userId = req.user.id;
  const { roomId, userId } = req.query; // roomId와 userId를 쿼리 파라미터에서 추출

  if (!roomId) {
    return res.status(400).json({ error: 'roomId is required' });
  }

  try {
    const room = await Room.findOne({ where: { name: roomId } });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const roomMapping = await UserRoomMapping.findAll({ where: { roomId: room.id } });

    // if (roomMapping.length !== 2) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    const userIds = roomMapping.map(mapping => mapping.userId);
    // console.log(userIds);
    // console.log(userId);
    const userIdNum = parseInt(userId, 10); // userId를 숫자로 변환
    if (!userIds.includes(userIdNum)) {
      return res.status(403).json({ error: 'Unauthorized'});
    }

    res.status(200).json({ message: 'Welcome to the chat room!', isAuth : true  });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
  
    // 사용자 특정 방에 참여
    socket.on('joinRoom', async ({ userId, roomId }) => {
      try {
        // await UserRoomMapping.create({ userId, roomId });

        socket.join(roomId);
        console.log(`${userId} joined room ${roomId}`);
      } catch (error) {
        console.error('Error adding user to room: ', error);
      }
    });
  
      // 메시지를 특정 방으로 전송
    socket.on('sendMessage', ({ roomId, message }) => {
      io.to(roomId).emit('message', message);
      // console.log(`Message sent to room ${roomId}: ${message}`);
    });


    // 방으로 메시지 보내기
    socket.on('message', async ({ roomId, message, userName, timestamp }) => {
      socket.to(roomId).emit('message', { message, userName, timestamp } );

      try { // 메시지를 ChatHistory 테이블에 저장
        console.log(userId, realRoomId);
        // await ChatHistory.create({ 
        //   content: message,
        //   userId: userId,
        //   roomId: realRoomId,
        //   createDate: new Date()
        // });
      } catch (error) {
        console.error('Failed to save chat history: ', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return router;
}



//module.exports = router;