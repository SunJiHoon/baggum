const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./User'); // User 모델이 정의된 파일에서 sequelize 객체 가져오기

// ChatHistory 모델 정의
class ChatHistory extends Model {}

// ChatHistory 모델의 속성 정의
ChatHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'id',
    }
  }
}, {
  sequelize,
  modelName: 'ChatHistory',
});

module.exports = ChatHistory;