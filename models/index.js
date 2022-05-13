const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user'); // 현재 디렉토리에서 user.js의 User객체를 가져옴
const Post = require('./post'); // 현재 디렉토리에서 post.js의 Post객체를 가져옴
const Hashtag = require('./hashtag'); // 현재 디렉토리에서 hashtag,js의 Hashtag객체를 가져옴

const db = {}; // db객체 생성
const sequelize = new Sequelize( // MySql 연결 객체를 생성
  config.database, config.username, config.password, config,
);
// config: 데이터베이스 설정파일, 사용자이름, DB이름, 비밀번호 등의 정보가 들어있음
// 즉 config.json에서 데이터베이스 이름, 사용자 이름, 비밀번호등을 가져와 Sequelize를 이용해 MySal과 연결한다

db.sequelize = sequelize; // db객체의 sequelize에 sequelize(MySql의 연결 객체)을 넣는다
db.User = User; // db객체에 User객체를 넣는다
db.Post = Post; // db객체에 Post객체를 넣는다
db.Hashtag = Hashtag; // db객체에 Hashtag객체를 넣는다

User.init(sequelize); // User모델의 static.init 메서드를 호출한다, init이 실행되어야 테이블이 모델로 연결된다
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db); // 다른 테이블과의 관계를 연결하는 associate 매서드도 실행한다
Post.associate(db);
Hashtag.associate(db);

module.exports = db; // db객체를 내보낸다
// 앞으로 db객체를 require하여 User, Post, Hashtag모델에 접근할 수 있다