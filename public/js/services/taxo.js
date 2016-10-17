angular.module('taxoService', [])
    .factory('TaxonomyLevels', ['$http', function($http) {
        return {
            get: function(searchTerm) {
                return $http.get('/api/getTaxonomy/' + searchTerm);
            },
            getInCounts: function(newData) {
                return $http.get('/api/getCommonInLinks/' + JSON.stringify({ 'firstName': newData[0], 'secondName': newData[1] }));
            },
            getOutCounts: function(newData) {
                return $http.get('/api/getCommonOutLinks/' + JSON.stringify({ 'firstName': newData[0], 'secondName': newData[1] }));
            }
        }
    }])
