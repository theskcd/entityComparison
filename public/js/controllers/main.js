angular.module('nodeController', [])

// inject the Node service factory into our controller
.controller('mainController', ['$scope', '$http', 'Nodes', function($scope, $http, Nodes) {
    $scope.formData = {};
    $scope.loading = true;

    // GET =====================================================================
    // when landing on the page, get all nodes and show them
    // use the service to get all the nodes
    Nodes.get()
        .success(function(data) {
            $scope.nodes = data;
            $scope.loading = false;
        });
}]);
