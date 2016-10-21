var request = require('request');
var cheerio = require('cheerio');
var Nightmare = require('nightmare');
var PythonShell = require('python-shell');
var systemProxy = "htttp://10.3.100.207:8080";

module.exports = function(app) {

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
                                                    result.push(lotsOfData.children[2].children[0].data);
                                                }
                                            }
                                            resolve('done');
                                        });
                                        jsonPromise.then(function() {
                                            if (index + 1 < lengthArray) {
                                                loopingOverInput(index + 1);
                                            } else {
                                                res.send(result);
                                                // console.log(result);
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

    app.get('/api/getSummary/:name', function(req, res) {
        var siteUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" + req.params.name;
        request({
            url: siteUrl,
            proxy: systemProxy
        }, function(error, response, body) {
            var jsonResponse = JSON.parse(body);
            res.send({ 'data': jsonResponse.extract });
        })
    });

    app.get('/api/getGenSim/:newTOCs', function(req, res) {
        console.log('Begin Gensim');
        var data = JSON.parse(decodeURIComponent(req.params.newTOCs));
        console.log(data);
        var options = {
            mode: 'json',
            scriptPath: 'scripts/comparison',
            args: [data.TOC1, data.TOC2]
        };
        var pyshell = new PythonShell('Wordnet.py', options);
        pyshell.on('message', function(message) {
            res.send(message);
        });

        pyshell.end(function(err) {
            if (err) throw err;
            console.log('finished');
        });
    });

};
