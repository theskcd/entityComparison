var request = require('request');
var cheerio = require('cheerio');
var systemProxy = "htttp://10.3.100.207:8080";

module.exports = function(app) {

    app.get('/api/getDataAnimals', function(req, res) {
        var siteUrl = "https://en.wikipedia.org/wiki/List_of_animals_by_common_name";
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

    app.get('/api/getDataPlants', function(req, res) {
        var siteUrl = "https://en.wikipedia.org/wiki/List_of_plants_by_common_name";
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

};