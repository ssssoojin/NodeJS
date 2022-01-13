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
         //스키마 정의
         var MemberSchema = new mongoose.Schema({
            userId : {type: String , required:true, unique:true},
            userPwd :  {type: String , required:true},
            userName: {type: String, index:'hashed'},
            age: {type: Number,'default':-1},
            regDate: {type: Date, index:{unique:false},'default':Date.now},
            updateDate: {type: Date, index:{unique:false},'default':Date.now}
       });
        
       //스키마에 static 메소드 추가
        MemberSchema.static('findById', function(userId, callback){
            return this.find({userId:userId}, callback);
        });
        //모든 문서 데이터 반환
        MemberSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        console.log('스키마가 정의됨' );
        
        //MemberModel 정의
        MemberModel = mongoose.model("members2", MemberSchema);
        console.log('MemberModel 정의함.');
    });
    
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}
       

var router = express.Router();
//로그인 라우팅 함수-데이터베이스의 정보와 비교
router.route('/process/login').post(function (req, res) {
    console.log('process/login 호출됨');
    
   //요청 파라미터 확인
   var userId = req.body.userId || req.query.userId;
   var userPwd = req.body.userPwd || req.query.userPwd;
   console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //db가 연결되었으면
    if(database){
        authMember(database, userId, userPwd, function(err,docs){
            if(err){
                console.log(err.stack);
                throw err; 
            }
            
            if(docs){
                console.dir(docs);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 성공 </h1>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1> 로그인 실패 </h1>');
                res.end();
            }
        });
     //db랑 연결안됬으면
    }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1> DB 연결 실패 </h1>');
            res.write('<div><p> DB에 연결하지 못했습니다 </p></div>');
            //res.write("<br><br><a href='/public/login.html'> 다시 로그인 </a>");
            res.end();     
    }
    
});



app.use('/', router);
// 사용자를 인증하는 함수
var authMember = function(database, userId, userPwd, callback){
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd );
    
    //ID로 검색
    MemberModel.findById(userId, function(err,results){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log('아이디 [%s]로 검색 결과 ',userId);
        console.log(results);
        
        if(results.length>0){
            console.log('ID와 일치하는 사용자 찾음');
            
            //비밀번호 확인
            if(results[0]._doc.userPwd == userPwd){
                console.log('비밀번호 일치함');
                callback(null,results);
            }else{
                console.log('비밀번호 일치하지 않음');
                callback(null,null);
            }
        
        }else{
            console.log('아이디와 일치하는 사용자를 찾지 못함');
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