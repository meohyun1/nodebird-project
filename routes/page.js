const express = require('express');

const router = express.Router(); // 라우터 객체를 생성한다

router.use((req, res, next) => { // 라우터에 들어온 모든 요청에 아래 미들웨어를 실행
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = []; // 템플릿 엔진에 사용할 변수들을 res.locals로 설정
    next();
});

router.get('/profile', (req, res) => { // 요청이 /page/profile로 들어오면 아래 미들웨어를 실행
    res.render('profile', { title: '내 정보 - NodeBird' }); // 템플릿 엔진을 렌더링해서 응답할 때 사용하는 매서드
}); // views폴더의 profile.html을 렌더링한다 (title은 뭐지)

router.get('/join', (req, res) =>  { // 요청이 /page/join으로 들어오면 아래 미들웨어를 실행
    res.render('join', { title: '회원가입 - NodeBird' });
}); // views폴더의 join.html을 렌더링한다

router.get('/', (req, res, next) => { // 요청이 /page로 들어오면 아래 미들웨어 실행
    const twits = []; // twits배열 생성
    res.render('main', { // views폴더의 main.html를 가져와 렌더링한다
        title: 'NodeBird', // 템플릿 엔진의 데이터들
        twits,
    });
});

module.exports = router; // router객체를 내보낸다