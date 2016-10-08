var express=require('express');
var app=express();
var port=process.env.PORT || 8080;

var morgan=require('morgan');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var session=require('express-session');
var path=require('path');
var fs=require('fs');
var request=require('request');
var cheerio=require('cheerio');

var APIRouter=require('./app/routes/APIRouter');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','jade');

app.use('/api/v1/',APIRouter);

app.get('/',function (req,res){
	res.send('The API is at http://localhost:'+port+'/api');
})

console.log('Let the hacking begin!');

app.listen(port);
console.log('The Hacking beings at port '+ port);