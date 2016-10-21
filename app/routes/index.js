var path = require('path');

module.exports = function(app) {
	
    require('./inoutLinks.js')(app);
    require('./getPlantsAnimals.js')(app);
    require('./mongoRetrieve.js')(app);
    require('./helpers.js')(app);

    app.get('*', function(req, res) {
        res.sendFile(path.resolve('public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });
};
