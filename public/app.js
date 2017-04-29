(function () {
    var app = angular.module("smsApp", []);

    app.controller("myCtrl", ['$scope', '$http', function($scope, $http) {
        $scope.loading = true;
        $http.get('/contacts').then(function (data) {
            $scope.contacts = data.contacts;
            $scope.loading = false;
        })
    }]);
}());