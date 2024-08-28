// index.js
const express = require('express');
const http = require('http'); // <-- http 모듈을 불러옵니다.
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server); // CORS 설정 없이 socket.io 서버를 설정

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",    // 로컬 개발 환경
      "http://3.34.54.89:5000",    // 실제 배포된 서버
      "https://baggumi.com",
      "https://api.baggumi.com",
      "http://localhost:5000",    // 로컬 개발 환경
    ],
    // methods: ["GET", "POST"],
    credentials: true,
  }
});

const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
// const config = require('./config/key')
// const { auth } = require('./middleware/auth')
const { sequelize, User } = require('./models/User'); // sequelize 객체 가져오기
const Room = require('./models/Room');
const UserRoomMapping = require('./models/UserRoomMapping');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.json());
//application/jsonn
app.use(bodyParser.json());
app.use(cookieParser());
const cors = require('cors'); // Import the cors package

const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    // 'http://3.34.54.89:5000',
    // 'http://3.34.54.89:3000',
    'https://baggumi.com',
    'https://api.baggumi.com',
  ] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

// 모델 동기화
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));


// 라우트
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')(io);
const merchandiseRoutes = require('./routes/merchandiseRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const smtpRoutes = require('./routes/smtpRoutes');
const { Server } = require('https');
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/merchandise', merchandiseRoutes);
app.use('/api/chat/read', chatHistoryRoutes);
app.use('/api/smtp', smtpRoutes);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
