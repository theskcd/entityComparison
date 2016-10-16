angular.module('searchController', [])
    .controller('mainController', ['$scope', '$http', 'TaxonomyLevels', function($scope, $http, TaxonomyLevels) {
        $scope.$watch('search', function() {
            if ($scope.search != "")
                fetch();
        });

        $scope.search = "";

        function fetch() {
            console.log("Initiating search for " + $scope.search);
            TaxonomyLevels.get($scope.search)
                .success(function(data) {
                    console.log(data);
                    $scope.taxonomylevels = data;
                });
        }

        $scope.select = function() {
            this.setSelectionRange(0, this.value.length);
        }
    }]);
