// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 30000;

//MongoDB 계정 생성
//MongoDB 클러스터 생성, 이때 가장 가까우면서 무료인 서버 추천
//MongoDB 유저 생성, 이때 아이디 비번/비번 기억 + Connection Method는 Application
//Mongoose, MongoDB를 편하게 가용 가능하게 해주는 툴 인스톨
//npm install mongoose --save

//App과 DB연결:
//const mongoose = require('mongoose')
//mongoose.connect('Connection String 입력'), {
//  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
//}).then(() => console.log('MongoDB Connected...))
//  .catch(err => console.log(Error))


// Body parser middleware 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// 'public' 디렉토리를 정적 파일 서빙 디렉토리로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
const loginRouter = require('./routes/login');
const aboutRouter = require('./routes/about');
app.use('/login', loginRouter);
app.use('/about', aboutRouter);


// 기본 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
