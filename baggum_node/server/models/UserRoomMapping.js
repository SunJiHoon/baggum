const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./User'); // User 모델이 정의된 파일에서 sequelize 객체 가져오기
const User = require('./User').User;
const Room = require('./Room'); // Room 모델 가져오기

// User-Room 매핑 모델 정의
const UserRoomMapping = sequelize.define('UserRoomMapping', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  timestamps: false, // 필요에 따라 timestamps를 비활성화할 수 있음
});

// 관계 설정
User.belongsToMany(Room, { through: UserRoomMapping, foreignKey: 'userId' });
Room.belongsToMany(User, { through: UserRoomMapping, foreignKey: 'roomId' });

module.exports = UserRoomMapping;