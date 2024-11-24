const { DataTypes } = require('sequelize');
const { sequelize } = require('./User'); // User 모델에서 sequelize 가져오기
const User = require('./User').User;

const Photo = sequelize.define('Photo', {
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: { // User의 id를 참조하는 외래키
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // User 테이블 이름
      key: 'id',
    },
    onDelete: 'CASCADE', // 유저 삭제 시 관련 사진도 삭제
  },
});

// 관계 정의
User.hasMany(Photo, { foreignKey: 'userId', as: 'photos' }); // User -> Photo 1:N 관계
Photo.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Photo -> User N:1 관계

module.exports = Photo;