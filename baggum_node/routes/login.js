const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  // 간단한 로그인 로직 예시 (실제 애플리케이션에서는 DB 연동 필요)
  if (username === 'user' && password === 'pass') {
    res.send('Login successful');
  } else {
    res.send('Invalid username or password');
  }
});

module.exports = router;