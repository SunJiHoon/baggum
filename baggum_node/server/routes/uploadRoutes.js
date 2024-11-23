// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/dev'); // config.js 파일 불러오기

const router = express.Router();

// 이미지 파일을 저장할 디렉토리 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'uploads'); // 파일이 저장될 폴더
    cb(null, config.UPLOAD_DIR); // 파일이 저장될 폴더를 절대 경로로 지정

  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post('/', upload.single('image'), (req, res) => {
  try {
    const filePath = path.join('uploads', req.file.filename);
    res.status(200).json({ success: true, imagePath: filePath });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

module.exports = router;