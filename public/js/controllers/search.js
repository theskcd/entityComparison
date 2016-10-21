angular.module('searchController', [])
    .controller('mainController', ['$scope', '$http', 'TaxonomyLevels', 'comparisonMetrics', function($scope, $http, TaxonomyLevels, comparisonMetrics) {
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
            TaxonomyLevels.getTOC($scope.search1)
                .success(function(data) {
                    console.log(data);
                    $scope.entity1TOC = data;
                });
        }

        function fetch2() {
            console.log("Initiating search for " + $scope.search2);
            TaxonomyLevels.get($scope.search2)
                .success(function(data) {
                    console.log(data);
                    $scope.taxonomylevels2 = data;
                });
            TaxonomyLevels.getTOC($scope.search2)
                .success(function(data) {
                    console.log(data);
                    $scope.entity2TOC = data;
                });
        }

        $scope.$watchGroup(['search1', 'search2'], function(newData) {
            if ($scope.search1 != "" && $scope.search2 != "") {
                TaxonomyLevels.getInCounts(newData)
                    .success(function(data) {
                        $scope.inLinksInfo = data;
                    });
                TaxonomyLevels.getOutCounts(newData)
                    .success(function(data) {
                        $scope.outLinksInfo = data;
                    });
            }
        });

        $scope.$watchGroup(['entity1TOC', 'entity2TOC'], function(newTOCs) {
            if (Object.prototype.toString.call($scope.entity1TOC) === '[object Array]' && Object.prototype.toString.call($scope.entity2TOC) === '[object Array]') {
                comparisonMetrics.getGensim(newTOCs)
                    .success(function(data) {
                        $scope.genSimResult = data;
                    });
            }
        });

        $scope.select = function() {
            this.setSelectionRange(0, this.value.length);
        }
    }]);
