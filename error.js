var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session');
var app = express();
//에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404' : './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})