const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User } = require('../models/User');

router.post('/register', (req, res) => {
  const user = new User(req.body);
  console.log('Request Body:', req.body);

  user.save()
    .then(savedUser => {
      console.log('User saved:', savedUser);
      return res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error(err);
      return res.json({ success: false, err });
    });
});

router.post('/login', async (req, res) => {
  console.log(req);

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.json({ loginSuccess: false, message: "제공된 이메일에 해당하는 유저가 없습니다." });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    }

    console.log("비밀번호가 맞습니다. 토큰 생성 중");
    const token = await user.generateToken();

    res.cookie("x_auth", token)
      .status(200)
      .json({ loginSuccess: true, userId: user.id });

  } catch (error) {
    console.error('로그인 중 에러 발생:', error);
    return res.status(500).json({ success: false, error: '서버 에러 발생' });
  }
});

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.userId,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

/*
router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(user => res.status(200).send({ success: true }))
    .catch(err => {
      console.log(err);
      return res.json({ success: false, err });
    });
});
*/

router.get('/logout', auth, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    
    if (user) {
      await user.update({ token: "" });
      return res.status(200).json({ success: true , message: "로그아웃 성공"});
    } else {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "로그아웃 실패", error: error.message });
  }
});




module.exports = router;