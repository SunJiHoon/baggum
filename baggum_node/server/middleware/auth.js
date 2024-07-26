const { User } = require('../models/User')

let auth = async (req,res,next) => {
    //인증 처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    console.log("토큰 출력");
    console.log(token);
    // 토큰이 존재하지 않을 경우
    if (typeof token !== 'string' || token.trim() === '') {
        return res.json({ isAuth: false, error: 'No token provided' });
    }
    // JWT 형식 검증
    if (!/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./.test(token)) {
        return res.json({ isAuth: false, error: 'Invalid token or user not found' });
      }
  
    // //토큰을 복호화한 후 유저를 찾는다
    // User.findByToken(token, (err, user)=>{
    //     if(err) throw err;
    //     if(!user) return res.json({isAuth: false, error: true});
    //     req.token = token;
    //     req.user = user;
    //     next();
    // })
    // 토큰을 복호화한 후 유저를 찾는다
    const user = await User.findByToken(token);
    // 사용자 또는 토큰이 유효하지 않은 경우
    if (!user) {
        return res.status(401).json({ isAuth: false, error: 'Invalid token or user not found' });
    }

    // 인증 성공
    req.token = token;
    req.user = user;
    next();
  
    // User
    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No!

};

module.exports = { auth }