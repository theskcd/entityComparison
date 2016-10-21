angular.module('comparisonService', [])
    .factory('comparisonMetrics', ['$http', function($http) {
        return {
            getGensim: function(newData) {
                return $http.get('/api/getGensim/' + JSON.stringify({ 'TOC1': newData[0], 'TOC2': newData[1] }));
            }
        }
    }])
