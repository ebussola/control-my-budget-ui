angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    })

    .controller('MyDailyBudgetMonthlyGoalsController', function ($scope, $http) {
        $scope.monthly_goals = $http.get('http://cmb.ebussola.com/api.php/goals').then(function (response) {
            $scope.monthly_goals = response.data;
        });
    })

    .controller('MyDailyBudgetController', function ($scope, $http, $stateParams) {
        $scope.monthly_goals = $http.get('http://cmb.ebussola.com/api.php/my-daily-budget/' + $stateParams.monthly_goal_id)
            .then(function (response) {
                $scope.daily_budget = response.data;
            });
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    });