const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./User'); // User 모델이 정의된 파일에서 sequelize 객체 가져오기
const Room = require('./Room'); // Room 모델 가져오기
const User = require('./User').User;

// ChatHistory 모델 정의
class ChatHistory extends Model {}

// ChatHistory 모델의 속성 정의
ChatHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: { // 채팅 내용
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdDate: { // 채팅 전송 시각
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  userId: { // 채팅을 보낸 유저의 id
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  roomId: { // 채팅이 보내진 채팅방 id
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