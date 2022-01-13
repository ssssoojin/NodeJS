var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static'),
    cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
extended: false
}));
app.use(bodyParser.json());
var router = express.Router();
router.route('/process/setUserCookie').get(function(req, res) {
    console.log('process/setUserCookie 호출됨');
    //쿠키설정
    res.cookie('user', {
        id: 'conan',
        name: '코난',
        authorized: true
    });
    //redirect로 응답
    res.redirect('/process/showCookie');
    });
router.route('/process/showCookie').get(function(req, res) {
console.log('process/showCookie 호출됨');
res.send(req.cookies);
});


app.use('/', router);
app.listen(3000, function () {
console.log('Express 서버가 3000번 포트에서 시작');
})
