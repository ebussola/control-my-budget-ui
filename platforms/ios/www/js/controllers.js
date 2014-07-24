var api_domain = '192.168.0.20:8000';

angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    })

    .controller('MyDailyBudgetMonthlyGoalsController', function ($scope, $http) {
        $scope.monthly_goals = $http.get('http://' + api_domain + '/api.php/goals').then(function (response) {
            $scope.monthly_goals = response.data;
        });
    })

    .controller('MyDailyBudgetController', function ($scope, $http, $stateParams) {
        $scope.monthly_goals = $http.get('http://' + api_domain + '/api.php/my-daily-budget/' + $stateParams.monthly_goal_id)
            .then(function (response) {
                $scope.daily_budget = response.data;
            });
    })

    .controller('MonthlyGoalController', function ($scope, $http) {
        $scope.monthly_goals = $http.get('http://' + api_domain + '/api.php/goals').then(function (response) {
            $scope.monthly_goals = response.data;
        });
    })

    .controller('MonthlyGoalNewController', function ($rootScope, $scope, $location, $http, $ionicPopup, transformRequestAsFormPost) {
        if ($location.path() == '/app/monthly-goals/new') {
            $scope.monthly_goal = {
                events: []
            };
        } else {
            $scope.monthly_goal = $rootScope.monthly_goal;
        }

        var reset_event = function () {
            $scope.event = {
                category: 'fds'
            };
        };
        reset_event();

        var add_event = function () {
            $scope.monthly_goal.events.push($scope.event);
        };
        $scope.submit_to_step2 = function () {
            $rootScope.monthly_goal = $scope.monthly_goal;
            $location.path('/app/monthly-goals/new-step-2');
        };
        $scope.add_one_more_event = function () {
            add_event();
            $ionicPopup.alert({
                title: 'Event added',
                template: 'Press OK to continue'
            });
            reset_event();
        };
        $scope.finish = function () {
            if ($scope.event.name != null) {
                add_event();
            }

            // normalizing data
            var monthly_goal = $scope.monthly_goal;
            monthly_goal.month = monthly_goal.date.split('-')[1];
            monthly_goal.year = monthly_goal.date.split('-')[0];
            delete monthly_goal.date;

            $http.post('http://' + api_domain + '/api.php/goals', {
                monthly_goal: JSON.stringify(monthly_goal)
            }, {
                transformRequest: transformRequestAsFormPost,
                headers: {
                    'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
                }
            }).then(function() {
                $location.path('/app/monthly-goals');
            });
        };
    });