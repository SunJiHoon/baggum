const express = require('express');
const router = express.Router();

// 방 생성 라우트
router.post('/create-room', (req, res) => {
  const roomId = Math.random().toString(36).substr(2, 9);
  res.status(200).json({ roomId });
});

module.exports = router;