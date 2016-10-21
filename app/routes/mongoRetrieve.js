var path = require('path');
var Node = require(path.resolve('./app/models/node'));

function getNodes(res) {
    Node.find(function(err, nodes) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(nodes); // return all nodes in JSON format
    });
};

module.exports = function(app) {
    // get all nodes
    app.get('/api/nodes', function(req, res) {
        // use mongoose to get all nodes in the database
        getNodes(res);
    });
};