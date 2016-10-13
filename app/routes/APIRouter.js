var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Nightmare = require('nightmare');
var nightmare = Nightmare({
    show: true
})

router.use(function(req, res, next) {
    next();
});

router.route('/getDataAnimals')
    .get(function(req, res) {
        var siteUrl = "https://en.wikipedia.org/wiki/List_of_animals_by_common_name";
        var systemProxy = "htttp://10.3.100.207:8080";
        console.log(siteUrl);
        request({
            url: siteUrl,
            proxy: systemProxy
        }, function(error, responses, html) {
            if (!error) {
                console.log('no error');
                var $ = cheerio.load(html);
                $('.mw-body-content').each(function(i, element) {
                    var data = $(this);
                    for (var i = 0; i <= data.children()[3].children.length - 1; i++) {
                        if (data.children()[3].children[i].attribs != undefined &&
                            data.children()[3].children[i].attribs.class == "div-col columns column-width") {
                            // console.log("class is written as " + data.children()[3].children[i].attribs.class);
                            for (var j = 0; j < data.children()[3].children[i].children.length; j++) {
                                if (data.children()[3].children[i].children[j] != undefined &&
                                    data.children()[3].children[i].children[j].name != undefined &&
                                    data.children()[3].children[i].children[j].name == "ul") {
                                    // console.log(data.children()[3].children[i].children[j].children.length);
                                    if (data.children()[3].children[i].children[j].children[0].parent != undefined) {
                                        // console.log(data.children()[3].children[i].children[j].children[0].parent);
                                        if (data.children()[3].children[i].children[j].children[0].parent.children != undefined) {
                                            for (var k = 0; k < data.children()[3].children[i].children[j].children[0].parent.children.length; k++) {
                                                if (data.children()[3].children[i].children[j].children[0].parent.children[k].type == "tag") {
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
            } else {
                console.log(error + ' stupid error!');
            }
        });
    });

router.route('/getDataPlants')
    .get(function(req, res) {
        var siteUrl = "https://en.wikipedia.org/wiki/List_of_plants_by_common_name";
        var systemProxy = "htttp://10.3.100.207:8080";
        console.log(siteUrl);
        request({
            url: siteUrl,
            proxy: systemProxy
        }, function(error, responses, html) {
            if (!error) {
                console.log('no error');
                var $ = cheerio.load(html);
                $('.mw-body-content').each(function(i, element) {
                    var data = $(this);
                    for (var i = 0; i <= data.children()[3].children.length - 1; i++) {
                        if (data.children()[3].children[i].type != undefined) {
                            if (data.children()[3].children[i].type == "tag") {
                                if (data.children()[3].children[i].name == "ul" && data.children()[3].children[i].children != undefined) {
                                    for (var j = 0; j < data.children()[3].children[i].children.length; j++) {
                                        if (data.children()[3].children[i].children[j].name != undefined &&
                                            data.children()[3].children[i].children[j].name == "li") {
                                            for (var k = 0; k < data.children()[3].children[i].children[j].children.length; k++) {
                                                if (data.children()[3].children[i].children[j].children[k].type != undefined &&
                                                    data.children()[3].children[i].children[j].children[k].type == "tag") {
                                                    if (data.children()[3].children[i].children[j].children[k].attribs != undefined) {
                                                        if (data.children()[3].children[i].children[j].children[k].attribs.href != undefined) {
                                                            console.log(data.children()[3].children[i].children[j].children[k].attribs);
                                                        }
                                                    }
                                                    for (var l = 0; l < data.children()[3].children[i].children[j].children[k].children.length; l++) {
                                                        if (data.children()[3].children[i].children[j].children[k].children[l].type != undefined &&
                                                            data.children()[3].children[i].children[j].children[k].children[l].type == "tag") {
                                                            if (data.children()[3].children[i].children[j].children[k].children[l].attribs != undefined) {
                                                                if (data.children()[3].children[i].children[j].children[k].children[l].attribs.href != undefined) {
                                                                    console.log(data.children()[3].children[i].children[j].children[k].children[l].attribs);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (data.children()[3].children[i].name == "dl") {
                                    for (var j = 0; j < data.children()[3].children[i].children.length; j++) {
                                        if (data.children()[3].children[i].children[j].type != undefined &&
                                            data.children()[3].children[i].children[j].type == "tag") {
                                            for (var k = 0; k < data.children()[3].children[i].children[j].children.length; k++) {
                                                if (data.children()[3].children[i].children[j].children[k].type != undefined &&
                                                    data.children()[3].children[i].children[j].children[k].type == "tag") {
                                                    for (var l = 0; l < data.children()[3].children[i].children[j].children[k].children.length; l++) {
                                                        if (data.children()[3].children[i].children[j].children[k].children[l].type != undefined &&
                                                            data.children()[3].children[i].children[j].children[k].children[l].type == "tag") {
                                                            for (var m = 0; m < data.children()[3].children[i].children[j].children[k].children[l].children.length; m++) {
                                                                if (data.children()[3].children[i].children[j].children[k].children[l].children[m].type != undefined &&
                                                                    data.children()[3].children[i].children[j].children[k].children[l].children[m].type == "tag") {
                                                                    if (data.children()[3].children[i].children[j].children[k].children[l].children[m].children[0].attribs != undefined) {
                                                                        console.log(data.children()[3].children[i].children[j].children[k].children[l].children[m].children[0].attribs);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                })
            } else {
                console.log(error + ' stupid error!');
            }
        });
    });

router.route('/getCommonOutLinks/')
	.get(function(req,res){
        console.log('teting');
        // console.log(req);
		var siteUrl="https://en.wikipedia.org/wiki/";
		var systemProxy="htttp://10.3.100.207:8080";
        var linkSetFirst=[];
        var linkSetSecond=[];
        var fillLists=function(){
        	var callitIn=function(){
                console.log("inside callitIn");
                request({url:siteUrl+"lion",proxy:systemProxy},function(error,responses,html){
        			$=cheerio.load(html);
        			links=$('a');
        			$(links).each(function(i,link){
                        linkSetFirst.push($(link).attr('href'));
        				// console.log($(link).text()+":\n "+$(link).attr('href'));
        			})
        		});
                request({url:siteUrl+"tiger",proxy:systemProxy},function(error,responses,html){
                    $=cheerio.load(html);
                    links=$('a');
                    $(links).each(function(i,link){
                        linkSetSecond.push($(link).attr('href'));
                        // console.log($(link).text()+":\n "+$(link).attr('href'));
                    })
                });
            };
            callitIn();
        };
        var comapreLists=function(){
            console.log('get going');
            fillLists(function(){
                console.log(linkSetFirst.length+ " " + linkSetSecond.length);
                var sameLinks;
                sameLinks=0;
                var compareBoth=function(){
                    for(var indexFirst=0;indexFirst<=linkSetFirst.length;indexFirst++){
                        if(indexFirst==linkSetFirst.length){
                            res.send({
                                'lengthCommon' : sameLinks,
                                'lengthFirstSet' : linkSetFirst.length,
                                'lengthSecondSet' : linkSetSecond.length
                            });
                        }
                        else{
                            for(var indexSecond=0;indexSecond<linkSetSecond.length;indexSecond++){
                                if(linkSetFirst[indexFirst]==linkSetSecond[indexSecond]){
                                    sameLinks++;
                                    break;
                                }
                            }
                        }
                    }
                }
                compareBoth();
            });
        };
        comapreLists();
	});


router.route('/getTaxonomy/:name')
    .get(function(req, res) {
    	console.log(req.body.name);
        nightmare
            .goto('https://www.ncbi.nlm.nih.gov/taxonomy/?'+ "term=" + req.body.name)
            .click('.rprt .title a')
            .wait('li')
            .evaluate(function() {
                var els = document.getElementsByTagName("a"),
                    result = []
                for (var i = 0, _len = els.length; i < _len; i++) {
                    var el = els[i]
                    if (el.hasAttribute('title') && el.hasAttribute('alt') && el.hasAttribute('href')) {
                        if (el.getAttribute('href').indexOf('lin=f&keep=1&srchmode=1&unlock') != -1)
                            result.push(el.childNodes[0].data);
                    }
                }
                return result
            })
            .end()
            .then(function(result) {
                console.log(result);
            })
            .catch(function(error) {
                console.error('Search failed:', error);
            });
    });

module.exports = router;
