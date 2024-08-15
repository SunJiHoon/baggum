const express = require('express');
const router = express.Router();
const UserRoomMapping = require('../models/UserRoomMapping');
const Room = require('../models/Room');
const ChatHistory = require('../models/ChatHistory')

// 단일 채팅 내역 조회
router.get('/read/:id', async (req, res) => {
    try {
        const chat = await ChatHistory.findOne({ where: { id: req.params.id } });
    
        if (!chat) {
          return res.status(404).json({ success: false, message: "해당 ID의 채팅을 찾을 수 없습니다." });
        }
        return res.status(200).json({ success: true, chat });
      } catch (error) {
        return res.status(500).json({ success: false, message: "채팅 조회 실패", error: error.message });
      }
})