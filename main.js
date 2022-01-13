var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static');
 
var app = express();

app.set('port',process.env.PORT || 3000);
 
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
 
app.use(static(path.join(__dirname, 'public')));
 
app.use(function (req, res, next) {
    console.log('첫 번째 미들웨어 요청 처리');
 
    var paramUserId = req.body.userId || req.query.userId;
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
 
    res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param id: ' + paramUserId + '</p></div>');
    res.write('<div><p>Param password: ' + paramUserPwd + '</p></div>');
    res.end();
});

app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})
 