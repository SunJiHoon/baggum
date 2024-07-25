// index.js
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User');


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


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,
    // {
    //     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // }
).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! asdfasdf');
});

app.get("/api/hello", (req,res) =>{
  res.send("안녕하세요 ~ ");
})

app.post("/api/hello", (req,res) =>{
  res.send("잘가세요 ~ ");
})


app.post('/api/users/register',(req,res) => {
    //client로부터 회원 정보 추출
    //db에 저장
    const user = new User(req.body);
    console.log('Request Body:', req.body);

    // user.save((err, userInfo)=>{
    //     if(err) return res.json({success : false, err});
    //     return res.status(200).json({
    //         success: true
    //     })
    // })
    user.save()
    .then(savedUser => {
        console.log('User saved:', savedUser);
        return res.status(200).json({
                    success: true
                })
    })
    .catch(err => {
        console.error(err);
        return res.json({success : false, err});
    });
}
);


app.post('/api/users/login',(req,res) => {
  console.log(req);
  //요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({email: req.body.email})
  .then(user=>{
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
      //비밀번호까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        //토큰을 저장한다. 어디에? 쿠키, 
        if(err) return res.status(400).send(err);
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess:true, userId:user._id})
      })
    })
  })
  .catch(err => {
    console.error(err);
    return res.json({success : false, err});
  });

});



app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
  res.status(200).json({
    _id : req.userId,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id : req.user._id}, {token : ""})
  .then(user=>{
    return res.status(200).send({
      success: true
    })
  })
  .catch(err=>{
    console.log(err);
    return res.json({success:false, err});
  })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
