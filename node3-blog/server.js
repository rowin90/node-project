const express=require('express');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const fs=require('fs');
const pathLib=require('path');
const consolidate=require('consolidate');
const mysql=require('mysql');

// 连接池
const db = mysql.createPool({host:'localhost',user:'root',password:'123456',database:'blog'});

var server = express();
server.listen(8080);


// 1.解析cookie

server.use(cookieParser('dsadsaddsadsadggfdgr'))

// 2.使用session
var arr=[];
for (var i = 0; i < 10000; i++) {
    arr.push('keys_'+ Math.random())
}
server.use(cookieSession({name:'sess',keys:arr,maxAge:20*3600*100}))

// 3.post数据
server.use(bodyParser.urlencoded({extended:false}))
server.use(multer({dest:'./www/upload/'}).any())



// 4.配置模板引擎

// 输出什么东西
server.set('view engine','html')
// 模板文件放在哪了
server.set('views','./template/')
// 那种模板引擎
server.engine('html',consolidate.ejs)



// 接受用户请求
server.get('/',(req,res)=>{


    // 查询banner的东西
    db.query('SELECT * FROM banner_table' ,(err,data)=>{
        if(err){
            console.log(err)
            res.status(500).send('database error').end();

        }else{
            console.log(data)
            res.render('index.ejs',{banners:data})
        }
    })
})

// 4.static数据
server.use(express.static('./www/'))

