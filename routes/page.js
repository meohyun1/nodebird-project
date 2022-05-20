const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 현재 디렉토리의 middlewares파일을 가져옴
const { Post, User, Hashtag } = require('../models'); // Post와 User모델을 가져옴

const router = express.Router(); // 라우터 객체를 생성한다

router.use((req, res, next) => { // 라우터에 들어온 모든 요청에 아래 미들웨어를 실행
    res.locals.user = req.user;  // 넌적스에서 user객체를 통해 사용자 정보에 접근, req.user는 user의 데이터
    res.locals.followerCount = req.user ? req.user.Followers.length : 0; // 로그인한 경우(req.user가 참) 팔로워 수를 넣는다
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : []; // 템플릿 엔진에 사용할 변수들을 res.locals로 설정
    // 팔로워 아이디 리스트를 넣는 이유는 팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면 팔로우 버튼을 보여주기 위해(넌적스)
    next();
});

router.get('/profile', isLoggedIn, (req, res) => { // 요청이 /profile로 들어오면 아래 미들웨어를 실행
    res.render('profile', { title: '내 정보 - NodeBird' }); // 템플릿 엔진을 렌더링해서 응답할 때 사용하는 매서드
}); // views폴더의 profile.html을 렌더링한다 (title은 뭐지)
// isLoggedIn 미들웨어를 사용, 만약 isAuthenticated()가 falsa면 메인 페이지로 이동

router.get('/join', isNotLoggedIn, (req, res) =>  { // 요청이 /join으로 들어오면 아래 미들웨어를 실행
    res.render('join', { title: '회원가입 - NodeBird' });
}); // views폴더의 join.html을 렌더링한다

router.get('/', async (req, res, next) => { // 요청이 /로 들어오면 아래 미들웨어 실행
    try {
    // const twits = []; // twits배열 생성, 이젠 필요없다
    const posts = await Post.findAll({ // 모든 게시글 조회
        include: [{ // join한다
            model: User,
            attributes: ['id', 'nick'], // 게시글 속성은 아이디와 닉네임
        }, {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Liker',
        }],
        order: [['createdAt', 'DESC']], // 생성된 시간순으로 내림차순(최신순)
    });
    if(req.user) {
        posts.forEach((post) => post.liked = !!post.Liker.find((v) => v.id === req.user.id));
    }
    res.render('main', { // views폴더의 main.html를 가져와 렌더링한다
        title: 'NodeBird', // 템플릿 엔진의 변수
        twits: posts, // 데이터베이스에서 조회한 결과를 넣는다
    });
    } catch (err) {
        console.log(err)
        next(err);
    }
});
// GET /hashtag?hashtag=(req.query.hashtag)
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } }); // 쿼리에 맞는 hashtag가 존재하는가
        let posts = [];
        if (hashtag) { // hashtag가 있으면
            posts = await hashtag.getPosts({ include: [{ model: User, attributes: ['id', 'nick'] }] });
        } // Post에 있는 hashtag를 가져온다. 이때 사용자의 정보도 가져온다

        return res.render('main', {
            title: `#${query} 검색 결과 | NodeBird`,
            twits: posts, // 렌더링 하면서 전체 게시글 대신 조회된 게시글만 twits에 넣어 렌더링한다
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router; // router객체를 내보낸다