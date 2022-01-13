// var express = require('express'), http = require('http');
// //익스프레스 객체 생성
// var app = express();
// //기본 포트를 app 객체에 속성으로 설정
// app.set('port', process.env.PORT || 3000);
// //Express 서버 시작
// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });
// app.listen(app.get('port'),()=>
//     console.log('익스프레스 서버를 시작했습니다.:'+app.get('port')));


// let express = require('express'), http = require('http');
// let app = express();
// app.use(function(req, res, next){
//     console.log('첫 번째 미들웨어에서 요청 처리');
//     res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서 응답</h1>');
// });
// app.listen(3000, function(){
//     console.log('Express 서버가 3000번 포트에서 start');
// })

let express = require('express'), http = require('http');
let app = express();
app.use(function(req, res, next){
    console.log('첫 번째 미들웨어 요청 처리');
    req.user = 'conan';
    next();
});
app.use('/', function(req, res, next){
    console.log('두 번째 미들웨어 요청 처리');
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>Express 서버에서 ' + req.user +'가 응답함</h1>');
});
app.listen(3000, function(){
         console.log('Express 서버가 3000번 포트에서 start');
  })

