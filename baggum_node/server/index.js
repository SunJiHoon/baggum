// index.js
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { sequelize, User } = require('./models/User'); // sequelize 객체 가져오기


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.json());
//application/jsonn
app.use(bodyParser.json());
app.use(cookieParser());
const cors = require('cors'); // Import the cors package

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000',] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options


// 모델 동기화
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));



// app.get('/', (req, res) => {
//   res.send('Hello World! asdfasdf');
// });

// app.get("/api/hello", (req,res) =>{
//   res.send("안녕하세요 ~ ");
// })

// app.post("/api/hello", (req,res) =>{
//   res.send("잘가세요 ~ ");
// })

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);



// app.post('/api/users/register',(req,res) => {
//     //client로부터 회원 정보 추출
//     //db에 저장
//     const user = new User(req.body);
//     console.log('Request Body:', req.body);

//     // user.save((err, userInfo)=>{
//     //     if(err) return res.json({success : false, err});
//     //     return res.status(200).json({
//     //         success: true
//     //     })
//     // })
//     user.save()
//     .then(savedUser => {
//         console.log('User saved:', savedUser);
//         return res.status(200).json({
//                     success: true
//                 })
//     })
//     .catch(err => {
//         console.error(err);
//         return res.json({success : false, err});
//     });
// }
// );

// app.post('/api/users/login', async (req, res) => {
//   console.log(req);

//   try {
//     // 요청된 이메일을 데이터베이스에서 찾는다.
//     const user = await User.findOne({
//       where: { email: req.body.email }
//     });

//     if (!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "제공된 이메일에 해당하는 유저가 없습니다."
//       });
//     }

//     // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인.
//     const isMatch = await user.comparePassword(req.body.password);

//     if (!isMatch) {
//       return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
//     }

//     // 비밀번호가 맞다면 토큰을 생성하기.
//     console.log("비밀번호가 맞습니다. 토큰 생성 중");
//     const token = await user.generateToken();

//     // 토큰을 저장한다. 어디에? 쿠키에
//     res.cookie("x_auth", token)
//       .status(200)
//       .json({ loginSuccess: true, userId: user.id });

//   } catch (error) {
//     console.error('로그인 중 에러 발생:', error);
//     return res.status(500).json({ success: false, error: '서버 에러 발생' });
//   }
// });


// app.get('/api/users/auth', auth, (req, res) => {
//   //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
//   res.status(200).json({
//     _id : req.userId,
//     isAdmin : req.user.role === 0 ? false : true,
//     isAuth: true,
//     email: req.user.email,
//     name: req.user.name,
//     lastname: req.user.lastname,
//     role: req.user.role,
//     image: req.user.image,
//   });
// });

// app.get('/api/users/logout', auth, (req, res)=>{
//   User.findOneAndUpdate({_id : req.user._id}, {token : ""})
//   .then(user=>{
//     return res.status(200).send({
//       success: true
//     })
//   })
//   .catch(err=>{
//     console.log(err);
//     return res.json({success:false, err});
//   })
// })



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
