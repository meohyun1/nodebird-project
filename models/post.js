const Sequelize = require('sequelize');
// Post테이블(사용자의 게시글이나 이미지가 들어있다, 사용자의 아이디는 나중에 관계를 설정할 때 시퀄라이즈가 알아서 생성)
module.exports = class Post extends Sequelize.Model { // Post모델을 만들고 모듈로 내보냄
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
      db.Post.belongsTo(db.User);
      db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // 중간 테이블 PostHashtag이 생성된다
      db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker' });
  }
};