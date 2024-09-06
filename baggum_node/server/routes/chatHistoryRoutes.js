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

router.get('/chat/page', async (req, res)=>{
  const messages = [
    { user: 'User 3', message: "안녕하세요! 등록하신 상품에 관심이 있습니다. 아직 구매 가능한가요?", time: '10:20 AM', unreadCount: 0 },
    { user: 'User 2', message: '안녕하세요! 네, 가격은 협상 가능합니다. 얼마를 제안하시겠습니까?', time: '12:00 PM', unreadCount: 1 },
    { user: 'User 1', message: '위치가 어디인가요?', time: '12:34 PM', unreadCount: 2 },
  ];
  res.json(messages);
})

module.exports = router;
