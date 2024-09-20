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
    const recipientEmail = `${emailId}@gmail.com`; // emailId를 사용하여 이메일 주소 생성 //@naver.com
    // console.log(config.EMAIL_USER);
    // console.log(config.EMAIL_PASS);
    
    const number = String(Math.floor(Math.random()*1000000)).padStart(6, "0")

    let message = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Demystifying Email Design</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    
    <body style = "margin: 0; padding: 0">
        <table align = "center" border = "0" cellpadding = "0" cellspacing = "0" width = "600">
            <tr>
                <td bgcolor="#E2E2E2" style = "padding : 50px 0 0 0;">
                </td>
            </tr>
            <tr>
                <td style = "padding: 0 0 0 10px;">
                    <img src = "cid:baggumLogo_2" alt = "바꿈 로고" width = "120" style = "display :block;">
                </td>               
            </tr>
            <tr>
                <td style = "font-size : 30px; font-weight: bolder; padding : 10px 0 10px 30px;">
                    회원가입을 위한 인증번호 입니다. 
                </td>
            </tr>
            <tr>
                <td> 
                    <hr align="left"/> 
                </td>
            </tr>
            <tr>
                <td style = "padding: 10px 0 15px 30px;">
                    안녕하세요, 바꿈입니다.
                </td>
            </tr>
            <tr>
                <td style = "padding: 0 0 0 30px;">
                    요청하신 이메일 인증을 위한 인증번호를 발송해드립니다.
                </td>
            </tr>
            <tr>
                <td style = "padding: 0 0 0 30px;">
                    아래의 인증번호를 인증번호 입력창에 입력해주세요.
                </td>
            </tr>
            <tr>
                <td style ="font-size: 40px; padding: 30px 0 30px 50px; font-weight: bolder;">
                    ${number}
                </td>
            </tr>
            <tr>
                <td style = "padding : 0 0 10px 30px;">
                    • 인증번호는 5분간 유효합니다. 
                </td>
            </tr>
            <tr>
                <td style = "padding : 0 0 40px 30px;" >
                    • 직접 요청하신 것이 아니라면 즉시 비밀번호를 변경해주시길 바랍니다.
                </td>
            </tr>
            <tr>
                <td bgcolor="#E2E2E2" style = "padding : 50px 0 0 0;">
                </td>
            </tr>
        </table>
    </body>
</html>`

    
    try {
        let mailOptions = {
            from: `"Your Name" <${config.EMAIL_USER}>`, // 보내는 사람 이메일 주소
            to: recipientEmail, // path parameter에서 생성된 받는 사람 이메일 주소
            subject: '[바꿈] 이메일 인증을 위한 인증번호 발송 메일입니다.', // 이메일 제목
            html: message, //'<h1>인증번호를 입력해주세요</h1>',
            // text: `This is a test email sent to ${recipientEmail}`, // 이메일 본문
        
            // 첨부파일
            attachments: {
                filename: 'baggumLogo',
                path: './client/public/images/baggumLogo_2.png',
                cid: 'baggumLogo_2' // should be as unique as possible
            }
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