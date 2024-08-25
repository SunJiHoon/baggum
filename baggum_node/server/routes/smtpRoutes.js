const express = require('express');
const router = express.Router();
const config = require('../config/dev'); // dev.js 파일 가져오기
const nodemailer = require('nodemailer');

// Gmail SMTP 서버 설정
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    ignoreTLS: false,
    secure: false,
        // service: 'gmail',
    auth: {
        user: config.EMAIL_USER, // 본인의 Gmail 주소
        pass: config.EMAIL_PASS,    // 앱 비밀번호
    },
});


router.get('/user/:emailId', async (req, res) => {
    const emailId = req.params.emailId; // path parameter로 emailId를 가져옴
    const recipientEmail = `${emailId}@naver.com`; // emailId를 사용하여 이메일 주소 생성
    // console.log(config.EMAIL_USER);
    // console.log(config.EMAIL_PASS);
    
    try {
        let mailOptions = {
            from: `"Your Name" <${config.EMAIL_USER}>`, // 보내는 사람 이메일 주소
            to: recipientEmail, // path parameter에서 생성된 받는 사람 이메일 주소
            subject: 'Test Email from Node.js', // 이메일 제목
            text: `This is a test email sent to ${recipientEmail}`, // 이메일 본문
        };

        // 이메일 보내기
        let info = await transporter.sendMail(mailOptions);

        console.log('Email sent: %s', info.messageId);
        res.status(200).send(`Email sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});


module.exports = router;