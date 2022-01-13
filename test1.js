// console.log('aaaa');
// console.log("문자열 보여주기 : %s","안녕!");
// console.log("JSON 객체 보여주기 : %j",{name:'코난'})
// var result = 0;
// console.time('elapsed Time');
// for(var i=1;i<=100; i++){
//     result +=1;
// }
// console.timeEnd('elapsedTime');
// ;
// console.log("1부터 100까지 합 : %d, result");

// console.log("현재 실행한 파일의 이름 : %s", __filename);
// console.log("현재 실행한 파일의 path : %s",__dirname);
// var Person = {name:'conan',age:10};
// console.dir(Person);

// function person(){};
// console.log(person.prototype);

// person.prototype.name ='conan';
// HTMLFormControlsCollection.log(person.prototype);



// setTimeout(()=>{
//     setTimeout(()=>{
//         console.log('todo:second');
//     },2000);
//     console.log('todo:first');
// },3000);

// var path =require('path');

// var directories =["users","mike","docs"];
// var docsDirectory = directories.join(path.sep);
// console.log('문서 디렉터리 : %s', docsDirectory);

// var curPath = path.join('/Users/mike','notepad.exe');
// console.log("파일 패스 : %s".curPath);

// var fs = require('fs');
// var data = fs.readFileSync('package.json','utf8');
// console.log(data);

// const fs= require('fs');
// fs.open('./output.txt','w',function(err,fd){
//     if(err) throw err;
//     const buf = Buffer.from('안녕!\n', 'utf-8');
//     fs.write(fd,buf,0,buf.length,null,function(err,written,buffer){
//         if(err) throw err;
//         console.log(err,written,buffer);
//         fs.close(fd,function(){
//             console.log("파일 열고 데이터 쓰고 파일 닫기 완료.");
//         });
//     });
// });

const { fstst } = require('fs');
var http = require('http');
var server = http.createServer();
var port = 3000;
server.listen(port,function(){
    console.log("웹 서버 시작. : %d",port);
});
server.on('connection',function(socket){
    var addr = socket.address();
    console.log('클라이언트가 접속. : %s, %d', addr.address,addr.port);
});
server.on('request',function(req,res){
    console.log('클라이언트가 요청함.');
    // res.writeHead(200,{"Content-Type" : "text/html;charset=utf-8"});
    // res.write("<!DOCTYPE html>");
    // res.write("<html>");
    // res.write("<head>");
    // res.write("<title>응답 페이지</title>");
    // res.write("</head>");
    // res.write("<body>");
    // res.write("<h1>노드제이에스로부터의 응답 페이지</h1>");
    // res.write("</body>");
    // res.write("<html>");
    // res.end;
    // var filename='conan.jpg';
    // fstat.readFile(filename,function(err,data){
    //     res.writeHead(200,{"Context-Type": "image/jpg"});
    //     res.write(data);
    //     res.end();
    // })
    var filename ='conan.jpg';
    var infile = fs.createReadStream(filename,{flags:'r'});
    infile.pipe(res);
});