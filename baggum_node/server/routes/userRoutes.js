const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User } = require('../models/User');
const UserRoomMapping = require('../models/userRoomMapping');

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

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(user => res.status(200).send({ success: true }))
    .catch(err => {
      console.log(err);
      return res.json({ success: false, err });
    });
});

router.get('/auth/chat', auth, async (req, res) => { // 해당 채팅방에 할당된 유저가 아니면 들어올 수 없음
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'roomId is required '});
  }

  try {
    const UserRoomMappings = await UserRoomMapping.findAll({ where: { roomId }});
    if (UserRoomMappings.length !== 2) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const userIds = UserRoomMappings.map(mapping => mapping.userId);
    if (!userIds.includes(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Welcome to the chat room!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;