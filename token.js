var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static');
 
var app = express();
 
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//라우터 사용하여 라우팅 함수 등록
var router = express.Router();
 
router.route('/process/users/:id').get(function(req, res) {
    console.log('첫 번째 미들웨어 요청 처리');
    //url 파라미터 확인
    var paramId = req.params.id;
 
    res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>Param id: ' + paramId + '</p></div>');
    res.end();
});
 
app.use('/', router);
 
app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})
