//Express 기본 모튤 불러오기
let express = require('express'),
    http = require('http'),
    path = require('path');
//Express 미들웨어 불러오기
let bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');
//오류 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
let expressSession = require('express-session')
//몽고디비 모듈 사용
let MongoClient = require('mongodb').MongoClient;
//몽구스 모듈 사용
var mongoose = require('mongoose');

// 데이터베이스 객체를 위한 변수 선언
let database;
 
// 데이터베이스 스키마 객체를 위한 변수 선언
let MemberSchema;
 
// 데이터베이스 모델 객체를 위한 변수 선언
let MemberModel;
 
// 데이터베이스에 연결
function connectDB(){
    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/bitDB';
    
    // 데이터베이스에 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise; //mongoose의 Promise객체는 global의 Promise객체 사용하도록 함
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function(){
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        // 스키마 정의
        MemberSchema = mongoose.Schema({
            userId: String,
            userPwd: String,
            userName: String
        });
        console.log('MemberSchema 정의함.');
        
        // MemberModel 모델 정의
        MemberModel = mongoose.model("members2", MemberSchema);
        console.log('MemberModel 정의함.');
    });
    
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}
//익스프레스 객체 생성
let app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key', resave: true, saveUninitialized: true
}));
//라우팅 함수 등록
var router = express.Router();
//로그인 라우팅 함수-데이터베이스의 정보와 비교
router.route('/process/login').post(function (req, res) {
    console.log('process/login 호출됨');
    //요청 파라미터 확인
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember함수 호출하여 사용자 인증
    if (database) {
        authMember(database, userId, userPwd,
            function (err, docs) {
                if (err) {throw err;}
                //조회된 레코드가 있으면 성공 응답 전송   
                if (docs) {
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf8"
                    });
                    res.write('<h1>로그인 성공</h1>');
                    res.end();
                } else {//조회된 레코드가 없는 경우 실패 응답 전송
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf8"
                    });
                    res.write('<h1>로그인 실패</h1>');
                    res.end();
                }
            });
    } else {
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf8"
        });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
}
);
router.route('/process/addMember').post(function(req, res){
    console.log('/process/addMember 호출됨.');
    
    var userId = req.body.userId || req.query.userId;
    var userPwd = req.body.userPwd || req.query.userPwd;
    var userName = req.body.userName || req.query.userName;
    
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if (database){
        addMember(database, userId, userPwd, userName, function(err, addedUser){
            if(err) {throw err;}
            
            //결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
            if(addedUser){
                console.dir(addedUser);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    }else{
        // 데이터베이스 객체가 초기화되지 않는 경우 실패응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
    
});

app.use('/', router);
// 사용자를 추가하는 함수
var addMember = function(database, userId, userPwd, userName, callback){
    console.log('addMember 호출됨 : ' + userId + ', ' + userPwd + ', '+userName);
    
    //UserModel 의 인스턴스 객체 생성
    var user = new MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName});
    
    // save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err,addedUser){
        console.log("addedUser%j",addedUser);
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null,addedUser);
    });
    
}
// 사용자를 인증하는 함수
var authMember = function(database, userId, userPwd, callback){
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd );
                
    // 아이디와 비밀번호를 사용해 검색
    UserModel.find({"userId":userId, "userPwd":userPwd}, function(err, results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과',userId,userPwd);
        console.dir(results);
        
        if(results.length > 0) {
            console.log('일치하는 사용자 찾음.', userId , userPwd)
            callback(null,results);
        }else{
            console.log('일치하는 사용자 찾지 못함.');
            callback(null,null);
        }
    });
}
//404 Error Handling
errorHandler = expressErrorHandler({
    static: { '404': './public/404.html'}
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
//서버 시작
app.listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트' + app.get('port'));
    connectDB(); //데이터베이스 연결
});