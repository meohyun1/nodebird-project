const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 현재 디렉토리의 middlewares파일을 가져옴

const router = express.Router(); // 라우터 객체를 생성한다

router.use((req, res, next) => { // 라우터에 들어온 모든 요청에 아래 미들웨어를 실행
    res.locals.user = req.user;  // 넌적스에서 user객체를 통해 사용자 정보에 접근, req.user는 user의 데이터
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = []; // 템플릿 엔진에 사용할 변수들을 res.locals로 설정
    next();
});

router.get('/profile', isLoggedIn, (req, res) => { // 요청이 /profile로 들어오면 아래 미들웨어를 실행
    res.render('profile', { title: '내 정보 - NodeBird' }); // 템플릿 엔진을 렌더링해서 응답할 때 사용하는 매서드
}); // views폴더의 profile.html을 렌더링한다 (title은 뭐지)
// isLoggedIn 미들웨어를 사용, 만약 isAuthenticated()가 falsa면 메인 페이지로 이동

router.get('/join', isNotLoggedIn, (req, res) =>  { // 요청이 /join으로 들어오면 아래 미들웨어를 실행
    res.render('join', { title: '회원가입 - NodeBird' });
}); // views폴더의 join.html을 렌더링한다

router.get('/', (req, res, next) => { // 요청이 /로 들어오면 아래 미들웨어 실행
    const twits = []; // twits배열 생성
    res.render('main', { // views폴더의 main.html를 가져와 렌더링한다
        title: 'NodeBird', // 템플릿 엔진의 데이터들
        twits,
    });
});

module.exports = router; // router객체를 내보낸다