var mongoose = require('mongoose');

module.exports = mongoose.model('Node', { _id: 'string', parent: 'string' });