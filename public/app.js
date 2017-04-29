(function () {
    let app = angular.module("smsApp", ['ui.router']);

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
        .controller("contactsCtrl", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
            $scope.loading = true;
            $http.get('/contacts').then(function (data) {
                $scope.contacts = data.data.contacts;
                $scope.loading = false;
                $timeout(function() {
                    $('select').material_select();
                    Materialize.updateTextFields();
                });
            });
            $scope.add = function() {
                $scope.contacts.push({
                    lang: 'en'
                });
                $timeout(function() {
                    $('select').material_select();
                    Materialize.updateTextFields();
                });
            };
            $scope.save = function() {
                $scope.loading = true;
                $http.put('/contacts', {
                    data: $scope.contacts
                }).then(function (data) {
                    console.log(data);
                });
            };
        }])
        .controller("messagesCtrl", ['$scope', '$http', function($scope, $http) {

        }]);
}());