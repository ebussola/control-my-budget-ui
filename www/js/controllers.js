var api_domain = 'localhost:8000';

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

        $scope.delete_it = function (monthly_goal) {
            $http.delete('http://' + api_domain + '/api.php/goal/' + monthly_goal.id)
                .then(function () {
                    $scope.monthly_goals.splice($scope.monthly_goals.indexOf(monthly_goal), 1);
                });
        };
    })

    .controller('MonthlyGoalNewController', function ($rootScope, $scope, $location, $http, $ionicPopup, transformRequestAsFormPost, $stateParams, $ionicModal) {
        var is_creating = ($location.path() == '/app/monthly-goals/new');
        var is_editing = ($location.path() == '/app/monthly-goals/' + $stateParams.monthly_goal_id + '/edit');

        if (is_creating) {
            $scope.title = 'Add new Monthly Goal';
            $scope.monthly_goal = {
                events: []
            };

        } else if (is_editing) {
            $scope.title = 'Editing Monthly Goal';

            $http.get('http://' + api_domain + '/api.php/goal/' + $stateParams.monthly_goal_id)
                .then(function (response) {
                    $scope.monthly_goal = response.data;
                    if ($scope.monthly_goal.month.length == 1) {
                        $scope.monthly_goal.month = '0' + $scope.monthly_goal.month;
                    }
                    $scope.monthly_goal.date = $scope.monthly_goal.year + '-' + $scope.monthly_goal.month;
                });

        } else {
            $scope.monthly_goal = $rootScope.monthly_goal;
        }

        var reset_event = function () {
            $scope.event = {
                category: 'fds'
            };
        };
        reset_event();

        $scope.add_event = function () {
            if ($scope.event.id == null) {
                $scope.monthly_goal.events.push($scope.event);
            }
            reset_event();
            $scope.closeModal();
        };

        $scope.delete_event = function (event) {
            $scope.monthly_goal.events.splice($scope.monthly_goal.events.indexOf(event), 1);
        };

        $scope.edit_event = function (event) {
            $scope.event = event;
            $scope.openModal();
        }

        $scope.finish = function () {
            // normalizing data
            var monthly_goal = $scope.monthly_goal;
            monthly_goal.month = monthly_goal.date.split('-')[1];
            monthly_goal.year = monthly_goal.date.split('-')[0];
            delete monthly_goal.date;

            var url;
            if (is_creating) {
                url = 'http://' + api_domain + '/api.php/goals';
            } else {
                url = 'http://' + api_domain + '/api.php/goal/' + $scope.monthly_goal.id;
            }
            $http.post(url, {
                monthly_goal: JSON.stringify(monthly_goal)
            }, {
                transformRequest: transformRequestAsFormPost,
                headers: {
                    'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
                }
            }).then(function () {
                $location.path('/app/monthly-goals');
            });
        };

        $ionicModal.fromTemplateUrl('templates/event-form.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    })

    .controller('ListMonthPurchaseController', function ($scope) {
        $scope.months = [];
        for (i = 0; i <= 5; i++) {
            $scope.months.push((1).months().fromNow().addMonths(-i));
        }
    })

    .controller('ListPurchaseController', function ($scope, $http, $stateParams, $rootScope, $location) {
        var month = parseInt($stateParams.month) - 1; // minus 1 because for javascript, January is 0
        var year = parseInt($stateParams.year);
        var date = Date.today().set({month: month, year: year});
        var month_lenght = new Date(year, month, 0).getDate();
        $http.get('http://' + api_domain + '/api.php/purchases/' + date.toString('yyyy-MM-01') + '/' + date.toString('yyyy-MM-') + month_lenght)
            .then(function (response) {
                $scope.purchases = response.data;
            });

        $scope.edit = function (purchase) {
            $rootScope.purchase = purchase;
            $location.path('/app/purchase/' + purchase.id + '/edit');
        };
    })

    .controller('NewPurchaseController', function ($scope, $http) {
        $scope.title = 'Add Purchase';

        $scope.purchase = {};

        $scope.finish = function () {
            $http.post('http://' + api_domain + '/api.php/purchases', $scope.purchase)
                .then(function () {
                    history.back();
                });
        }
    })

    .controller('EditPurchaseController', function ($scope, $http, $stateParams) {
        $scope.title = 'Edit Purchase';

        $http.get('http://' + api_domain + '/api.php/purchase/' + $stateParams.purchase_id).then(function (response) {
            $scope.purchase = response.data;
        });

        $scope.finish = function () {
            $http.post('http://' + api_domain + '/api.php/purchase/' + $stateParams.purchase_id, $scope.purchase)
                .then(function () {
                    history.back();
                });
        }
    });