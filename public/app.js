(function () {
    var app = angular.module("smsApp", ['ui.router']);

    app
        .config(function($stateProvider) {
            var contactsState = {
                name: 'contacts',
                url: '/contacts',
                templateUrl: 'contacts.html',
                controller: 'contactsCtrl'
            };

            $stateProvider.state(contactsState);
            $stateProvider.otherwise('/contacts');
        })
        .controller("contactsCtrl", ['$scope', '$http', function($scope, $http) {
        $scope.loading = true;
        $http.get('/contacts').then(function (data) {
            $scope.contacts = data.contacts;
            $scope.loading = false;
        })
    }]);
}());