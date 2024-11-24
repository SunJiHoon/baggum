// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/dev'); // config.js 파일 불러오기
// const { auth } = require('../middleware/auth');
const Photo = require('../models/Photo');
const dayjs = require('dayjs');
const fs = require('fs');

const router = express.Router();

// 이미지 파일을 저장할 디렉토리 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'uploads'); // 파일이 저장될 폴더
    const userId = req.headers['userid'];
    const userDir = path.join(config.UPLOAD_DIR, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true});
    }

    //cb(null, config.UPLOAD_DIR); // 파일이 저장될 폴더를 절대 경로로 지정
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const uniqueSuffix = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const userId = req.headers['userid']; // 헤더에서 userId 읽기
    // const filePath = path.join('uploads', req.file.filename);


    const filename = req.file.filename;

    // 데이터베이스에 사진 파일 이름과 유저 ID 저장
    await Photo.create({
      path: filename,
      userId: userId, // 외래키로 User의 id 저장
    });

    res.status(200).json({ success: true, imageFileName: filename });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

module.exports = router;