var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session');
var app = express();
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
var router = express.Router();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

router.route('/process/product').get(function(req, res){
    console.log('/process/product 호출됨');
    if (req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/login.html');
    }
});
    
router.route('/process/login').post(function (req, res) {
    console.log('/process/login 호출됨');
    var paramUserId = req.body.userId || req.query.userId;
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
    if (req.session.user) {//이미 로그인된 상태
        console.log('이미 로그인되어 상품페이지로 이동합니다.');
        res.redirect('/public/product.html');
    } else {
        //세션 저장
        req.session.user = {
            id: paramUserId,
            name: 'conan',
            authorized: true
        };
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>Param ID: ' + paramUserId + '</p></div>');
        res.write('<div><p>Param Password: ' + paramUserPwd + '</p></div>');
        res.write("<br><a href='/process/product'>상품 페이지로 이동하기</a>");
        res.end();
    }
});
// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res){
    console.log('/process/logout 호출됨');
    
    if(req.session.user){
        console.log('로그아웃');
        //로그인된 상태
        req.session.destroy(function(err){
            if(err) throw err;
            console.log('세션 삭제하고 로그아웃됨');
            res.redirect('/public/login.html');
        });
    }
    else{//로그인 안된 상태
        console.log('로그인 상태 아님');
        res.redirect('/public/login.html');
    }
});
//라우터 미들웨어를 사용하려면 익스프레스 객체에서 라우터 객체를 참조해서 사용한다.
// 그리고 라우팅 함수를 등록하면 app 객체에 설정한다.
app.use('/', router);
app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})
