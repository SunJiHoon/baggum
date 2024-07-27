// index.js
const express = require('express');
const http = require('http'); // <-- http 모듈을 불러옵니다.
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // 사용자 특정 방에 참여
  socket.on('joinRoom', ({ userId, roomId }) => {
    socket.join(roomId);
    console.log(`${userId} joined room ${roomId}`);
  });

  // 방으로 메시지 보내기
  socket.on('message', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
// const config = require('./config/key')
// const { auth } = require('./middleware/auth')
const { sequelize, User } = require('./models/User'); // sequelize 객체 가져오기


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.json());
//application/jsonn
app.use(bodyParser.json());
app.use(cookieParser());
const cors = require('cors'); // Import the cors package

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000',] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options


// 모델 동기화
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));


// 라우트
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')(io);
const { Server } = require('https');
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
