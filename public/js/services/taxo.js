angular.module('taxoService', [])
    .factory('TaxonomyLevels', ['$http', function($http) {
        return {
            get: function(searchTerm) {
                return $http.get('/api/getTaxonomy/' +  searchTerm);
            }
        }
    }])
