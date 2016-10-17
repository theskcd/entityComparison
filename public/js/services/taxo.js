angular.module('taxoService', [])
    .factory('TaxonomyLevels', ['$http', function($http) {
        return {
            get: function(searchTerm) {
                return $http.get('/api/getTaxonomy/' + searchTerm);
            },
            getCounts: function(newData) {
                linksInput = {};
                linksOutput = [];
                linksInput['firstName'] = newData[0];
                linksInput['secondName'] = newData[1];
                outLinksJson = $http.get('/api/getCommonOutLinks/' + linksInput);
                inLinksJson = $http.get('/api/getCommonInLinks/' + linksInput);
                linksOutput.push(outLinksJson);
                linksOutput.push(inLinksJson);
                return linksOutput;
            }
        }
    }])
