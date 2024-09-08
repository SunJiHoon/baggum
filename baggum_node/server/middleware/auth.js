const { User } = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config/dev');
const userRoutes = require('../routes/userRoutes');
const router = require('../routes/userRoutes');
const time = require('../models/time');



let auth = async (req,res,next) => {
    //인증 처리를 하는 곳
    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    console.log("토큰 출력");
    console.log(token);
    // 토큰이 존재하지 않을 경우
    if (typeof token !== 'string' || token.trim() === '') {
        req.tokenExp=1;
        return res.json({ isAuth: false, error: 'No token provided' });
    }
    // JWT 형식 검증
    if (!/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./.test(token)) {
        return res.json({ isAuth: false, error: 'Invalid token or user not found' });
      }
    console.log('JWT 형식검증 성공')

    try{
        // 토큰을 복호화한 후 유저를 찾는다
        const decoded = jwt.verify(token, config.ACCESS_SECRET);
        console.log('토큰 복호화 성공')
        const user = await User.findOne({ where: { id: decoded.id } });
        // 사용자가 없는 경우
        if(!user){
            return res.status(401).json({ isAuth: false, error: '유저가 없음' });
        }
        //last activity update
        user.last_activity = time.formatDate(new Date());
        req.tokenExp = 1;
        await user.save();
        console.log('유저 찾기 성공')

        // 인증 성공
        console.log('인증 성공');
        req.token = token;
        req.user = user;
        next();
        
    } catch(err){
        if(err.name === 'TokenExpiredError'){
            console.log('access 토큰 만료, 갱신 시도');
            try{
                const user = await User.findOne({ where: { access_token: token } });
                if(!user){
                    console.log('access 토큰: ', token);
                    return res.status(401).json({ isAuth: false, error: 'DB값 에러' })
                }
                //로그인 시간 만료 됐는지
                if(await user.isIdle()){
                    res.clearCookie('x_auth');
                    user.refresh_token = '';
                    req.tokenExp = 0;
                    await user.save();
                    return next();
                }
                const refresh_token = user.refresh_token;
                console.log('유저 정보 찾음.', refresh_token);
                const refresh_decoded = jwt.verify(refresh_token, config.REFRESH_SECRET);

                if(!refresh_decoded){
                    res.clearCookie('x_auth');
                    req.tokenExp = 0;
                    return next();
                }

                console.log('복호화 성공', token);
                const access_token = await user.generateAccessToken();
                console.log('refresh token으로 access token갱신', access_token);
                user.access_token = access_token;
                user.last_activity = time.formatDate(new Date());
                await user.save();
                console.log('access token을 db에 저장 성공');
                req.token = access_token;
                req.user = user;
                req.tokenExp=1;
                res.cookie("x_auth", access_token, {httpOnly: true, secure: true });

                return next();

            } catch(err){
                console.log('에러', err);
                return res.status(403).json({ isAuth: false, error: 'Refresh 토큰 만료, 로그아웃 처리'})
            }
        }
        else{
                return res.status(401).json({ isAuth: false, error: '인증오류' });
        }
    }

  
    // User
    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No!

};

module.exports = { auth }