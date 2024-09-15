const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/dev'); // dev.js 파일 가져오기
const time = require('../models/time');


// MySQL 데이터베이스 연결 설정
const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.DB_DIALECT
});

// User 모델 정의
class User extends Model {
  async comparePassword(plainPassword) {
    console.log("비밀번호 비교중");
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    console.log(isMatch);
    return isMatch;
    // return bcrypt.compare(plainPassword, this.password);
  }

  async generateAccessToken() {
    const token = jwt.sign({ id: this.id }, config.ACCESS_SECRET, { expiresIn: config.ACCESS_EXP_TIME });
    //아직 영국 시간에 맞춰져 있음.
    this.access_token = token;
    this.last_activity = time.formatDate(new Date());
    await this.save();
    return token;
  }

  async generateRefreshToken() {
    const token = jwt.sign({ id: this.id}, config.REFRESH_SECRET/*, { expiresIn: config.REFRESH_TOKEN_EXP_TIME }*/);
    this.refresh_token = token;
    //아직 영국시간에 맞춰져 있음.
    this.last_activity = time.formatDate(new Date());
    await this.save();
    return token;
  }

  async isIdle() {
    const now = Date.now();
    // `this.last_activity`가 문자열일 경우만 `parseDate`를 사용합니다.
    const lastActivity = typeof this.last_activity === 'string'
      ? new Date(time.parseDate(this.last_activity)).getTime()
      : new Date(this.last_activity).getTime();
    console.log('now', now)
    console.log('last', lastActivity)
    console.log(now - lastActivity > config.REFRESH_TOKEN_EXP_TIME);
    const timeDifference = now - lastActivity;
    return timeDifference > config.REFRESH_TOKEN_EXP_TIME;
  }


  static async findByToken(token) {
    try {
      const decoded = jwt.verify(token, config.ACCESS_SECRET);
      console.log(decoded, 'decoded 정보');
      const user = await User.findOne({ where: { id: decoded.id } });
      return user;
    } catch (err) {
      throw err;
    }
  }
}

// User 모델의 속성 정의
User.init({
  name: {
    type: DataTypes.STRING,
    maxLength: 50,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5],
    },
  },
  lastname: {
    type: DataTypes.STRING,
    maxLength: 50,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
  },
  access_token: {
    type:DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.STRING,
  },
  last_activity:{
    type: DataTypes.STRING,
  },
  tokenExp: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = { User, sequelize }; // sequelize 객체 내보내기
