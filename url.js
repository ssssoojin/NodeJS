const { publicDecrypt } = require('crypto');
var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static');
 
var app = express();
var router = express.Router();
app.set('port',process.env.PORT || 3000);
 
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
 
app.use('/public',static(path.join(__dirname, 'public')));
 
router.route('/process/login/:name').post(function(req, res) {
    console.log('첫 번째 미들웨어 요청 처리');
    var paramName = req.params.name;
    var paramUserId = req.body.userId || req.query.userId;
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
 
    res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param Name: ' + paramName + '</p></div>');
    res.write('<div><p>Param id: ' + paramUserId + '</p></div>');
    res.write('<div><p>Param password: ' + paramUserPwd + '</p></div>');
    res.write("<br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a>");
    res.end();
});
app.use('/', router); //라우터 객체를 app객체에 등록
app.all('*',function(req,res){ //등록되지 않은 패스에 대해 페이지 오류 응답
    res.status(404).send('<h1>ERROR. 페이지를 찾을 수 없습니다.</h1>');
})
app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})
 