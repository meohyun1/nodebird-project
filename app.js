// 모듈 불러오기
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config(); // 현재 디렉토리의 .env파일을 자동으로 인식하여 환경변수를 세팅
const pageRouter = require('./routes/page'); // 현재 디렉토리의 routes/page파일(상위 디렉토리는 ../file 로 사용)
const { sequelize } = require('./models'); // 현재 디렉토리의 models파일의 de객체의 sequelize(MySql 연결객체)를 불러온다

const app = express(); // express 객체를 app 변수에 할당, 익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할 가능
app.set('port', process.env.PORT || 8001); // 서버가 실행될 포트를 설정, process.env 객체에 PORT속성이 있다면 그 값을 사용하고 없다면 기본값으로 300을 사용
app.set('view engine', 'html'); // nunjucks를 템플릿 엔진으로 이용하겠다
nunjucks.configure('views', { // 첫번째 인수로 views 폴더의 경로를 넣는다
    express: app, // express 속성에 app객체를 연결한다
    watch: true, // html 파일이 변경될 때 템플릿 엔진을 다시 렌더링한다(true인 경우)
});
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan('dev')); // 모든 요청에 morgan('dev')를 실행
app.use(express.static(path.join(__dirname, 'public'))); // 디렉토리의 public파일의 정적인 파일들을 제공한다.(서버의 폴더 경로에는 public이 들어가지만 요청주소에는 public이 들어있지 않다)
// 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당 파일을 전송한다, 이 경우 다음에 나오는 라우터가 실행되지 않는다. 만약 파일을 찾지 못했다면 요청을 라우터로 넘긴다(떄문에 최대한 위쪽에 배치하자)
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // true면 qs모듈을 사용하고, fasle면 query-string 모듈을 사용한다
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false, // 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할것인가
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할것인가
    secret: process.env.COOKIE_SECRET, // 쿠키의 서명
    cookie: {
        httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못한다
        secure: false, // http가 아닌 환경에서도 사용할 수 있다
    },
}));

app.use('/', pageRouter); // 요청이 '/'인 경우 pageRouter을 실행

app.use((req,res,next) => { // 요청이 없는경우(찾지 못한 경우)
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404; //네트워크 상태는 404
    next(error); // 에러처리 미들웨어의 err로 연결된다
});

app.use((err, req, res, next) => { // 에러처리 미들웨어
    res.locals.message = err.message; // 템플릿 엔진에 변수를 주입
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // error객체의 스택 트레이스는 시스템 환경(NODE_ENV)이 배포환경이 아닌 경우에만 표시
    res.status(err.status || 500); // 네트워크 상태는 기본값으로 500지정
    res.render('error'); // error라는 템플릿 파일(넌적스이므로 error.html)을 렌더링 한다
    // 렌더링 시 res.locals.message와 res.locals.error에 넣어준 값을 함께 렌더링한다
});

app.listen(app.get('port'), () => { // 포트를 app.get('port')로 가져옴
    console.log(app.get('port'), '번 포트에서 대기 중');
});