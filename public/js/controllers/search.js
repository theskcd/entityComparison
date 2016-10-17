angular.module('searchController', [])
    .controller('mainController', ['$scope', '$http', 'TaxonomyLevels', function($scope, $http, TaxonomyLevels) {
        $scope.$watch('search1', function() {
            if ($scope.search1 != "")
                fetch1();
        });

        $scope.$watch('search2', function() {
            if ($scope.search2 != "")
                fetch2();
        });

        $scope.search1 = "";
        $scope.search2 = "";

        function fetch1() {
            console.log("Initiating search for " + $scope.search1);
            TaxonomyLevels.get($scope.search1)
                .success(function(data) {
                    console.log(data);
                    $scope.taxonomylevels1 = data;
                });
        }

        function fetch2() {
            console.log("Initiating search for " + $scope.search2);
            TaxonomyLevels.get($scope.search2)
                .success(function(data) {
                    console.log(data);
                    $scope.taxonomylevels2 = data;
                });
        }

        $scope.$watchGroup(['search1', 'search2'], function(newData) {
            if ($scope.search1 != "" && $scope.search2 != "") {
                TaxonomyLevels.getCounts(newData)
                    .success(function(data) {
                        console.log(data[0]);
                        console.log(data[1]);
                    });
            }
        });

        $scope.select = function() {
            this.setSelectionRange(0, this.value.length);
        }
    }]);
