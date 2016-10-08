var express=require('express');
var router=express.Router();
var request=require('request');
var cheerio=require('cheerio');
var fs=require('fs');

router.use(function(req,res,next){
	next();
});

router.route('/getDataAnimals')
	.get(function(req,res){
		var siteUrl="https://en.wikipedia.org/wiki/List_of_plants_by_common_name";
		var systemProxy="htttp://10.3.100.207:8080";
		console.log(siteUrl);
		request({url:siteUrl,proxy:systemProxy},function(error,responses,html){
			if(!error){
				console.log('no error');
				var $=cheerio.load(html);
				$('.mw-body-content').each(function(i,element){
					var data=$(this);
					for (var i = 0; i <= data.children()[3].children.length - 1; i++) {
						if(data.children()[3].children[i].attribs!=undefined && 
							data.children()[3].children[i].attribs.class=="div-col columns column-width"){
							// console.log("class is written as " + data.children()[3].children[i].attribs.class);
							for(var j=0;j<data.children()[3].children[i].children.length;j++){
								if(data.children()[3].children[i].children[j]!=undefined &&
									data.children()[3].children[i].children[j].name!=undefined &&  
									data.children()[3].children[i].children[j].name=="ul"){
									// console.log(data.children()[3].children[i].children[j].children.length);
									if(data.children()[3].children[i].children[j].children[0].parent!=undefined){
										// console.log(data.children()[3].children[i].children[j].children[0].parent);
										if(data.children()[3].children[i].children[j].children[0].parent.children!=undefined){
											for(var k=0;k<data.children()[3].children[i].children[j].children[0].parent.children.length;k++){
												if(data.children()[3].children[i].children[j].children[0].parent.children[k].type=="tag"){
													console.log(data.children()[3].children[i].children[j].children[0].parent.children[k].children[0].attribs);
												}
											}
										}
									}
								}
							}
						}
					};
				})
			}
			else{
				console.log(error+' stupid error!');
			}
		});
	});

module.exports=router;