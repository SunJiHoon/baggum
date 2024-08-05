const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./User'); // User 모델이 정의된 파일에서 sequelize 객체 가져오기

// Room 모델 정의
class Room extends Model {}

// Room 모델의 속성 정의
Room.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  sequelize,
  modelName: 'Room',
});

module.exports = Room;