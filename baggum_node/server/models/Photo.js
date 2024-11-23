const { DataTypes } = require('sequelize');
const { sequelize } = require('./User'); // User 모델에서 sequelize 가져오기

const Photo = sequelize.define('Photo', {
  path: {
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

module.exports = Photo;