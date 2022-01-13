let express = require('express'), http = require('http');
 
let app = express();
 
app.use(function(req, res, next){
    console.log('첫 번째 미들웨어 요청 처리');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    res.write('<div><p>User-Agent: ' + userAgent + '</p></div>');
    res.write('<div><p>Param Name: ' + paramName + '</p></div>');
    res.end();
});
 
app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 시작');
})
