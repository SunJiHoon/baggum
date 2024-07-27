const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MySQL 데이터베이스 연결 설정
const sequelize = new Sequelize('config.DB_NAME, config.DB_USER, config.DB_PASSWORD', {
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

  async generateToken() {
    const token = jwt.sign({ id: this.id }, 'secretToken');
    this.token = token;
    await this.save();
    return token;
  }

  static async findByToken(token) {
    try {
      const decoded = jwt.verify(token, 'secretToken');
      console.log(decoded);
      const user = await User.findOne({ where: { id: decoded.id, token } });
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
  token: {
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
