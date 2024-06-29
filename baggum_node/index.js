// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 30000;


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
