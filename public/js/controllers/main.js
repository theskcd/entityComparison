angular.module('nodeController', [])
    .controller('mainController', ['$scope', '$http', 'Nodes', function($scope, $http, Nodes) {
        $scope.formData = {};
        $scope.loading = true;
        Nodes.get()
            .success(function(data) {
                $scope.nodes = data;
                $scope.loading = false;
            });
    }]);
