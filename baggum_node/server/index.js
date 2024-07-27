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


const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')
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
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);





io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
