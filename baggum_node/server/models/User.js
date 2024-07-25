const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require("jsonwebtoken")

const userShema = mongoose.Schema({
    name:{
        type: String,
        maxlength : 50,
    },
    email:{
        type: String,
        trim: true,
        unique : 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image : String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


userShema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
    //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
    else{
        next()
    }
})

userShema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 암호화된 비밀번호  afpoisidfoasknvv 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

userShema.methods.generateToken = function(cb){
    var user = this;

    // const payload = { userId: user._id }; // 객체 형태로 페이로드를 구성
    //jsonwebtoken을 이용하여 토큰을 생성하기
    // var token = jwt.sign(user._id, 'secretToken')
    // var token = jwt.sign(payload, 'secretToken')
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token;
    // user.save(function(err, user){
    //     if(err) return cb(err);
    //     cb(null, user)
    // })

    user.save()
    .then(savedUser => {
      cb(null, savedUser); // 저장된 사용자 정보를 콜백으로 전달
    })
    .catch(err => {
      cb(err); // 에러를 콜백으로 전달
    });
  
}


userShema.statics.findByToken = function(token,cb){
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        // user.findOne({"_id" : decoded, "token": token }, function(err, user){
        //     if(err) return cb(err);
        //     cb(null, user)
        // })

        user.findOne({"_id" : decoded, "token": token })
        .then(user=>{
            cb(null, user)
        })
        .catch(err=>{
            return cb(err);
        });
    })

    
}

const User = mongoose.model('user', userShema)

module.exports = { User }