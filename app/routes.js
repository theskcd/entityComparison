var Node = require('./models/node');
var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Nightmare = require('nightmare');
var systemProxy = "htttp://10.3.100.207:8080";

function getNodes(res) {
    Node.find(function(err, nodes) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(nodes); // return all nodes in JSON format
    });
};

function sortNumber(a, b) {
    return a - b;
}

var linkSetFirst = [];
var linkSetSecond = [];
var getSameLinks = function(res) {
    console.log(linkSetFirst.length + " " + linkSetSecond.length);
    var sameLinks;
    sameLinks = 0;
    var compareBoth = function() {
        for (var indexFirst = 0; indexFirst <= linkSetFirst.length; indexFirst++) {
            if (indexFirst == linkSetFirst.length) {
                res.send({
                    'lengthCommon': sameLinks,
                    'lengthFirstSet': linkSetFirst.length,
                    'lengthSecondSet': linkSetSecond.length
                });
            } else {
                for (var indexSecond = 0; indexSecond < linkSetSecond.length; indexSecond++) {
                    if (linkSetFirst[indexFirst] == linkSetSecond[indexSecond]) {
                        sameLinks++;
                        break;
                    }
                }
            }
        }
    }
    compareBoth();
};

module.exports = function(app) {
    /////////////////////////////////////// API ///////////////////////////////////////
    // get all nodes
    app.get('/api/nodes', function(req, res) {
        // use mongoose to get all nodes in the database
        getNodes(res);
    });

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

    app.get('/api/getTaxonomy/:name', function(req, res) {
        console.log(req.params.name);
        var nightmare = Nightmare({
            show: false
        });
        nightmare
            .goto('https://www.ncbi.nlm.nih.gov/taxonomy/?' + "term=" + req.params.name)
            .click('.rprt .title a')
            .wait('li')
            .evaluate(function() {
                var els = document.getElementsByTagName("a"),
                    result = {
                        levels: []
                    };
                for (var i = 0, _len = els.length; i < _len; i++) {
                    var el = els[i]
                    if (el.hasAttribute('title') && el.hasAttribute('alt') && el.hasAttribute('href')) {
                        if (el.getAttribute('href').indexOf('lin=f&keep=1&srchmode=1&unlock') != -1) {
                            var jsonData = {};
                            jsonData['rank'] = el.title;
                            jsonData['name'] = el.childNodes[0].data;
                            result.levels.push(jsonData);
                        }
                    }
                }
                return result
            })
            .end()
            .then(function(result) {
                console.log(result);
                res.json(result);
            })
            .catch(function(error) {
                console.error('Search failed:', error);
            });
    });

    app.get('/api/getCommonOutLinks/:newData', function(req, res) {
        console.log('outLinksTesting');
        var siteUrl = "https://en.wikipedia.org/wiki/";
        var data = JSON.parse(decodeURIComponent(req.params.newData));
        linkSetFirst = [];
        linkSetSecond = [];

        var jsonPromies = new Promise(function(resolve, reject) {
            request({
                url: siteUrl + data.firstName,
                proxy: systemProxy
            }, function(error, responses, html) {
                $ = cheerio.load(html);
                links = $('a');
                for (var i = 0; i <= links.length; i++) {
                    if (i == links.length) {
                        var nextPromise = new Promise(function(resolve, reject) {
                            request({
                                url: siteUrl + data.secondName,
                                proxy: systemProxy
                            }, function(error, responses, html) {
                                $ = cheerio.load(html);
                                links = $('a');
                                console.log(links.length + data.secondName);
                                for (var i = 0; i <= links.length; i++) {
                                    if (i == links.length) {
                                        resolve('done with the first part');
                                    } else {
                                        if (links[i].attribs != undefined && links[i].attribs.href != undefined) {
                                            linkSetFirst.push(links[i].attribs.href);
                                        }
                                    }
                                };
                            });
                        });
                        nextPromise.then(function() {
                            resolve('done');
                        })
                    } else {
                        if (links[i].attribs != undefined && links[i].attribs.href != undefined) {
                            linkSetSecond.push(links[i].attribs.href);
                        }
                    }
                }
            });
        });
        jsonPromies.then(function() {
            getSameLinks(res);
        });
    });

    /// make the http call by sending request as $http.post(endpoint/{firstName:"name1", secondName:"name2"});
    app.get('/api/getCommonInLinks/:newData', function(req, res) {
        console.log('inLinksTesting');
        var siteUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=&list=backlinks&blnamespace=0&blfilterredir=nonredirects&bllimit=250&blredirect=1";
        var data = JSON.parse(decodeURIComponent(req.params.newData));
        console.log(data);
        var searchTerms = ["&bltitle=" + data.firstName, "&bltitle=" + data.secondName];
        linkSetFirst = [];
        linkSetSecond = [];
        var continueId, JsonReponse, o;

        (function loopingOverInput(i) {
            var jsonPromise = new Promise(function(resolve, reject) {
                var searchTerm = siteUrl + searchTerms[i];
                console.log(searchTerm);
                request({
                    url: searchTerm,
                    proxy: systemProxy
                }, function(error, response, body) {
                    if (!error) {
                        console.log('no error');
                        JsonReponse = JSON.parse(body);
                        o = JsonReponse.query.backlinks;
                        traverse = function(o) {
                            for (var j in o) {
                                if (i == 0) {
                                    linkSetFirst.push(parseInt(o[j].pageid, 10));
                                } else {
                                    linkSetSecond.push(parseInt(o[j].pageid, 10));
                                }
                                if (o[j] !== null && typeof(o[j]) == "object" && o[j].hasOwnProperty('redirlinks')) {
                                    traverse(o[j].redirlinks);
                                }
                            }
                        }
                        traverse(o);
                        (function more_results() {
                            if (JsonReponse.hasOwnProperty('continue')) {
                                continueId = JsonReponse.continue.blcontinue;
                                var nextSearchTerm = searchTerm + "&blcontinue=" + continueId;
                                request({
                                    url: nextSearchTerm,
                                    proxy: systemProxy
                                }, function(errorIn, responseIn, bodyIn) {
                                    if (!errorIn) {
                                        JsonReponse = JSON.parse(bodyIn);
                                        o = JsonReponse.query.backlinks;
                                        traverseMore = function(o) {
                                            for (var k in o) {
                                                if (i == 0) {
                                                    linkSetFirst.push(parseInt(o[k].pageid, 10));
                                                } else {
                                                    linkSetSecond.push(parseInt(o[k].pageid, 10));
                                                }
                                                if (o[k] !== null && typeof(o[k]) == "object" && o[k].hasOwnProperty('redirlinks')) {
                                                    traverseMore(o[k].redirlinks);
                                                }
                                            }
                                        }
                                        traverseMore(o);
                                    } else {
                                        console.log(errorIn + ' error!');
                                    }
                                    more_results();
                                });
                            } else {
                                //return promise over here
                                resolve('done');
                            }
                        }());
                    } else {
                        console.log(error + ' error!');
                    }
                });
            });
            jsonPromise.then(function() {
                if (i < 1) {
                    ++i;
                    loopingOverInput(i);
                } else {
                    linkSetFirst.sort(sortNumber);
                    linkSetSecond.sort(sortNumber);
                    getSameLinks(res);
                }
            })
        })(0);
    });

    app.get('/api/getTable/:name', function(req, res) {
        var siteUrl = "https://en.wikipedia.org/wiki/" + req.params.name;
        request({
            url: siteUrl,
            proxy: systemProxy
        }, function(error, responses, html) {
            if (!error) {
                console.log('no error');
                var $ = cheerio.load(html);
                var result = [];
                $('.mw-body-content').each(function(i, element) {
                    var data = $(this);
                    // console.log(data.children());
                    for (var i = 0; i <= data.children()[3].children.length - 1; i++) {
                        if (data.children()[3].children[i].attribs != undefined &&
                            data.children()[3].children[i].attribs.class == "toc") {
                            for (var j = 0; j < data.children()[3].children[i].children[3].children.length; j++) {
                                if (data.children()[3].children[i].children[3].children[j].children != undefined) {
                                    var lengthArray = data.children()[3].children[i].children[3].children[j].children.length;
                                    (function loopingOverInput(index) {
                                        var jsonPromise = new Promise(function(resolve, reject) {
                                            if (data.children()[3].children[i].children[3].children[j].children[index] != undefined &&
                                                data.children()[3].children[i].children[3].children[j].children[index].children != undefined) {
                                                var lengthArray = data.children()[3].children[i].children[3].children[j].children[index].children.length;
                                                var lotsOfData = data.children()[3].children[i].children[3].children[j].children[index];
                                                if (lotsOfData.type == "tag" && lotsOfData.name == "a") {
                                                    result.push({ 'tag': lotsOfData.children[2].children[0].data });
                                                }
                                            }
                                            resolve('done');
                                        });
                                        jsonPromise.then(function() {
                                            if (index + 1 < lengthArray) {
                                                loopingOverInput(index + 1);
                                            } else {
                                                res.send(result);
                                                console.log(result);
                                            }
                                        })
                                    })(0);
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

    /////////////////////////////////// Application ///////////////////////////////////
    // app.get('*', function(req, res) {
    //     res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    // });
};
