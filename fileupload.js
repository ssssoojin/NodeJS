
var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    static = require('serve-static'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session');

//파일 업로드용 미들웨어    
var multer = require('multer'),
    fs = require('fs'),
    //클라이언트에서 ajax로 요청시 CORS(다중 서버 접속) 지원
    cors = require('cors');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//public폴더와 uploads 폴더 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(expressSession({
secret: 'my key',
resave: true,
saveUninitialized: true
}));

app.use(cors()); //ajax 요청시 CORS(다중서버접속) 지원

var storage = multer.diskStorage({
destination: function (req, file, callback){
    callback(null, 'uploads')
},
filename: function (req, file, callback){
    callback(null, file.originalname + '-' + Date.now())
}
});

var upload = multer({
storage: storage,
limits: {
    files: 10, //파일개수제한 10개
    fileSize: 1024 * 1024 * 1024 //파일크기제한 1GB
}
});
router.route('/process/upload').post(upload.array('uploadedFile', 1), function(req, res){
    console.log('/process/upload 호출됨');
    
    try{
        var files = req.files;
        
        console.dir('#-----업로드된 첫번째 파일 정보-----#')
        console.dir(req.files[0]);
        console.dir('#------#')
        //현재의 파일 정보를 저장할 변수 선언
        var originalname = '', filename = '', mimetype = '', size = 0;
        
        if(Array.isArray(files)){//배열에 들어가 있는 경우(설정에서 1개의 파일도 배열에 넣게 했음)
            console.log("배열 파일 갯수: %d", files.length);
            
            for(var index=0; index<files.length; index++){
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        }else{//배열에 들어가 있지 않은 경우(현재 설정에서는 해당 없음)
            console.log("파일 갯수 : 1");
            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        
        console.log("현재 파일 정보: " + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
        
        //클라이언트에 응답 전송
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h3>업로드 성공</h3>');
        res.write('<hr />');
        res.write('<p>원본 파일이름: ' + originalname + '-> 저장 파일이름: ' + filename + '</p>');
        res.write('<p>MIMETYPE: ' + mimetype + '</p>');
        res.write('<p>SIZE: ' + size + '</p>');
        res.end();
    } catch(err) {
        console.dir(err.stack);
    }
});
 
app.use('/', router);
 
app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 시작');
})
