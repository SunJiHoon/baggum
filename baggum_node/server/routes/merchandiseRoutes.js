const express = require('express');
const router = express.Router();
const Merchandise = require('../models/Merchandise');

// 상품 등록
router.post('/register', (req, res) => {
  const merchandise = new Merchandise(req.body);
  console.log('Request Body:', req.body);

  merchandise.save()
    .then(savedMerchandise => {
      console.log('Merchandise saved:', savedMerchandise);
      return res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ success: false, err });
    });
});

// 상품 조회 (단일 상품 조회)
router.get('/:id', async (req, res) => {
  try {
    const merchandise = await Merchandise.findOne({ where: { id: req.params.id } });

    if (!merchandise) {
      return res.status(404).json({ success: false, message: "해당 ID의 상품을 찾을 수 없습니다." });
    }

    return res.status(200).json({ success: true, merchandise });
  } catch (error) {
    return res.status(500).json({ success: false, message: "상품 조회 실패", error: error.message });
  }
});

// 모든 상품 조회
router.get('/', async (req, res) => {
  try {
    const merchandiseList = await Merchandise.findAll();

    return res.status(200).json({ success: true, merchandiseList });
  } catch (error) {
    return res.status(500).json({ success: false, message: "상품 조회 실패", error: error.message });
  }
});

// 상품 수정
router.put('/:id', async (req, res) => {
  try {
    const merchandise = await Merchandise.findOne({ where: { id: req.params.id } });

    if (!merchandise) {
      return res.status(404).json({ success: false, message: "해당 ID의 상품을 찾을 수 없습니다." });
    }

    await merchandise.update(req.body);
    return res.status(200).json({ success: true, message: "상품 정보가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "상품 수정 실패", error: error.message });
  }
});

// 상품 삭제
router.delete('/:id', async (req, res) => {
  try {
    const merchandise = await Merchandise.findOne({ where: { id: req.params.id } });

    if (!merchandise) {
      return res.status(404).json({ success: false, message: "해당 ID의 상품을 찾을 수 없습니다." });
    }

    await merchandise.destroy();
    return res.status(200).json({ success: true, message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "상품 삭제 실패", error: error.message });
  }
});

module.exports = router;
