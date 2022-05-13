const Sequelize = require('sequelize');
// User테이블(사용자의 정보가 들어있다)
module.exports = class User extends Sequelize.Model { // User모델을 만들고 모듈로 exports 함, User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize) { // 테이블에 대한 설정(init은 시스템이 종료될 때까지 계속 실행되는 데몬 프로세스)
        return super.init({ // 첫번째 인수는 태아불 컬럼(열)에 대한 설정
            email: {
                type: Sequelize.STRING(40), // 컬럼에 대한 타입
                allowNull: true, // 컬럼에 NULL을 포함하는가
                unique: true, // 중복이 가능한가
            },
            nink: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local', // 기본값, provider가 local이면 기본 로그인, kakao면 카카오 로그인을 한 것이다
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, { // 두번째 인수는 테이블 자체에 대한 설정
            sequelize, // static init 매서드의 매개변수와 연결되는 옵션, db.sequelize 객체를 넣어야 한다
            timestamps: true, // true면 시퀄라이즈는 createdAt와 updateAt 컬럼을 추가한다, 각각 로우가 생성될 때와 수정될 떄의 시간이 자동으로 입력된다
            underscored: false, // 테이블명과 컬럼명을 캐멀케이스(createdAt)에서 스네이크케이스(created_at)으로 바꾸는 옵션
            modelName: 'User', // 모델 이름
            tableName: 'users', // 테이블 이름, 기본적으로 모델 이름을 소문자 및 복수형으로 만든다
            paranoid: true, // true면 deletedAt 컬럼을 만든다, 로우를 삭제할 때 완전히 지워지지 않고 deletedAt에 지운 시각이 기록된다(나중에 로우를 복원하기 위해 사용)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) { // 다른 모델과의 관계를 설정
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId', // 외래키 이름, 외래키 이름을 설정하지 않으면 UserId가 된다
            as: 'Followers', // 찾고 싶은 데이터라고 치면, 팔로워들을 찾고싶으면 먼저 팔로잉하는 아이디를 찾아야한다
            through: 'Follow', // 다대다 관계일 때 중간 테이블, Follow모델이 생성된다
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings', // as에 특정한 이름을 지정했으니 user.getFollowers, user.getFollowings 같은 관계 메서드를 사용할 수 있다
            through: 'Follow',
        });
    }
};