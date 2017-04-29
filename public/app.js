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
            let backup;
            $http.get('/contacts').then(function (data) {
                $scope.contacts = data.data.contacts;
                backup = _.cloneDeep($scope.contacts);
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
                }).then(function () {
                    backup = _.cloneDeep($scope.contacts);
                    $scope.contactForm.$setPristine();
                });
            };
            $scope.delete = function (index) {
                delete $scope.contacts[index];
            };
            $scope.cancel = function () {
                $scope.contacts = _.cloneDeep(backup);
            };
        }])
        .controller("messagesCtrl", ['$scope', '$http', function($scope, $http) {

        }]);
}());