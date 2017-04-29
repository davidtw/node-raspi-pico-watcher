(function () {
    var app = angular.module("smsApp", ['ui.router']);

    app
        .config(function($stateProvider) {
        })
        .controller("myCtrl", ['$scope', '$http', function($scope, $http) {
        $scope.loading = true;
        $http.get('/contacts').then(function (data) {
            $scope.contacts = data.contacts;
            $scope.loading = false;
        })
    }]);
}());