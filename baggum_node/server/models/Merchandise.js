const { Sequelize, DataTypes, Model } = require('sequelize');

// Merchandise 모델 정의
class Merchandise extends Model {}

// Merchandise 모델의 속성 정의
Merchandise.init({
  id: {  
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {  
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePath: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {  
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  desiredMerchandise: {  
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Merchandise',
});

module.exports = Merchandise;
