var mongoose = require('mongoose');


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


