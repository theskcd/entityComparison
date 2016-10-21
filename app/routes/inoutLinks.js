var request = require('request');
var cheerio = require('cheerio');
var systemProxy = "htttp://10.3.100.207:8080";

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
}
