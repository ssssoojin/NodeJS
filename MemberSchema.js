var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
     userId : {type: String , required:true, unique:true},
     userPwd :  {type: String , required:true},
     userName: String,
     age: Number,
     regDate: Date,
     updateDate: Date
});

mongoose.model('User', UserSchema);


