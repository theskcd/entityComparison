//==================================
//==ESSENTIALS======================
//==================================

var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Nightmare = require('nightmare');
var nightmare = Nightmare({
    show: true
})

//======================
//==PREFIX FOR ALL URL==
//======================
var siteUrlPrefix="http://localhost:8080/api/v1";
var systemProxy="http://10.3.100.207:8080";

var testingFunctions=function(){
	//=========================
	//==DECLARE FUNCTION HERE==
	//=========================
	var getCommonOutLinks=function(){
		request({
			url:siteUrlPrefix+"/getCommonOutLinks",
			names:{
				'firstName':'lion',
				'secondName':'tiger'
			}
		},
		function(error,response,body){
			console.log(response);
			console.log(error);
		})
	};

	//==========================
	//==CALL FUNCTIONS FROM HERE
	//==========================
	getCommonOutLinks();
}

testingFunctions();