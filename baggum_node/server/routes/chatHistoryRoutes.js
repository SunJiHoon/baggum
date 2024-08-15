const express = require('express');
const router = express.Router();
const UserRoomMapping = require('../models/UserRoomMapping');
const Room = require('../models/Room');
const ChatHistory = require('../models/ChatHistory')

// 단일 채팅 내역 id로 조회
router.get('/:id', async (req, res) => {
    try {
        const chat = await ChatHistory.findOne({ where: { id: req.params.id } });
    
        if (!chat) {
          return res.status(404).json({ success: false, message: "해당 ID의 채팅을 찾을 수 없습니다." });
        }
        return res.status(200).json({ success: true, chat });
      } catch (error) {
        return res.status(500).json({ success: false, message: "채팅 내역 조회 실패", error: error.message });
      }
});

// 단일 채팅 내역 roomId로 조회
router.get('/room/:id', async (req, res) => {
    try {
        const chatList = await ChatHistory.findAll({
          where: { roomId: req.params.id },
          order: [['createdDate', 'ASC']], // 오름차순 정렬
         });
    
        if (!chatList) {
          return res.status(404).json({ success: false, message: "해당 ID의 채팅방을 찾을 수 없습니다." });
        }
        return res.status(200).json({ success: true, chatList });
      } catch (error) {
        return res.status(500).json({ success: false, message: "채팅 내역 조회 실패", error: error.message });
      }
});

// 전체 채팅 내역 조회
router.get('/find/all', async (req, res) => {
    try {
      const chatList = await ChatHistory.findAll();
      return res.status(200).json({ success: true, chatList });
    } catch (error) {
      return res.status(500).json({ success: false, message: "채팅 내역 조회 실패", error: error.message });
    }
});

module.exports = router;
