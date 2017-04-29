(function () {
    var app = angular.module("smsApp", ['ui.router']);

    app
        .config(function($stateProvider, $urlRouterProvider) {
            let contactsState = {
                name: 'contacts',
                url: '/contacts',
                templateUrl: 'contacts.html',
                controller: 'contactsCtrl'
            };
            let messagesState = {
                name: 'messages',
                url: '/messages',
                templateUrl: 'messages.html',
                controller: 'messagesCtrl'
            };

            $stateProvider.state(contactsState);
            $stateProvider.state(messagesState);
            $urlRouterProvider.otherwise('/contacts');
        })
        .controller("contactsCtrl", ['$scope', '$http', function($scope, $http) {
            $scope.loading = true;
            $http.get('/contacts').then(function (data) {
                $scope.contacts = data.contacts;
                $scope.loading = false;
            })
        }])
        .controller("messagesCtrl", ['$scope', '$http', function($scope, $http) {

        }]);
}());