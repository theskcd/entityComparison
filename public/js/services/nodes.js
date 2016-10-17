angular.module('nodeService', [])
    // super simple service
    // each function returns a promise object 
    .factory('Nodes', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/nodes');
            }
        }
    }]);
