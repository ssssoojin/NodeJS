const http= require('http');
const options = {
    host:'www.google.com',
    port:80,
    path:'/'
};
const req=http.get(options,function(res){
    let resData='';
    res.on('data',function(chunk){
        resData+=chunk;
    });
    res.on('end',function(){
        console.log(resData);
    });
});
req.on('error',function(err){
    console.log("오류 발생"+err.message);
});