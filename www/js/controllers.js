angular.module('starter.controllers', [])

    .controller('AppCtrl', function (cmbFacebook, $scope, $ionicPopup) {
        $scope.is_logged = false;

        var _useAccessToken = function(access_token) {
            cmbFacebook.setAccessToken(access_token);
            $scope.is_logged = true;
        };

        document.addEventListener('deviceready', function() {
            facebookConnectPlugin.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    _useAccessToken(response.authResponse.accessToken);
                }
                else {
                    $scope.login();
                }
            });
        }, false);

        $scope.login = function() {
            facebookConnectPlugin.login(['public_profile'], function(response) {
                _useAccessToken(response.authResponse.accessToken);
            }, function(error) {
                alert(error);
            });
        };

        $scope.logout = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout',
                template: 'Do you want to logout of your facebook account?'
            });

            confirmPopup.then(function(yes) {
                if (yes) {
                    facebookConnectPlugin.logout();
                    cmbFacebook.flushAccessToken();
                    $scope.is_logged = false;
                }
            });
        };
    })

    .controller('MyDailyBudgetMonthlyGoalsController', function ($scope, cmbFacebook) {
        cmbFacebook.getMonthlyGoals()
            .then(function (response) {
                $scope.monthly_goals = response.data;
            });
    })

    .controller('MyDailyBudgetController', function ($scope, $stateParams, cmbFacebook) {
        cmbFacebook.getMyDailyBudget($stateParams.monthly_goal_id)
            .then(function (response) {
                $scope.daily_budget = response.data;
            });
    })

    .controller('MonthlyGoalController', function ($scope, cmbFacebook) {
        cmbFacebook.getMonthlyGoals()
            .then(function (response) {
                $scope.monthly_goals = response.data;
            });

        $scope.delete_it = function (monthly_goal) {
            cmbFacebook.deleteMonthlyGoal(monthly_goal.id)
                .then(function () {
                    $scope.monthly_goals.splice($scope.monthly_goals.indexOf(monthly_goal), 1);
                });
        };
    })

    .controller('MonthlyGoalNewController', function ($rootScope, $scope, $location, cmbFacebook, $ionicPopup, transformRequestAsFormPost, $stateParams, $ionicModal) {
        var is_creating = ($location.path() == '/app/monthly-goals/new');
        var is_editing = ($location.path() == '/app/monthly-goals/' + $stateParams.monthly_goal_id + '/edit');

        if (is_creating) {
            $scope.title = 'Add new Monthly Goal';
            $scope.monthly_goal = {
                events: []
            };

        } else if (is_editing) {
            $scope.title = 'Editing Monthly Goal';

            cmbFacebook.getMonthlyGoal($stateParams.monthly_goal_id)
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

            if (is_creating) {
                cmbFacebook.createMonthlyGoal(monthly_goal).then(function () {
                    $location.path('/app/monthly-goals');
                });
            } else {
                cmbFacebook.updateMonthlyGoal($scope.monthly_goal.id, monthly_goal).then(function () {
                    $location.path('/app/monthly-goals');
                });
            }
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

    .controller('ListPurchaseController', function ($scope, $stateParams, $rootScope, $location, cmbFacebook) {
        cmbFacebook.getPurchases($stateParams.month, $stateParams.year)
            .then(function (response) {
                $scope.purchases = response.data;
            });

        $scope.edit = function (purchase) {
            $rootScope.purchase = purchase;
            $location.path('/app/purchase/' + purchase.id + '/edit');
        };
    })

    .controller('NewPurchaseController', function ($scope, cmbFacebook) {
        $scope.title = 'Add Purchase';

        $scope.purchase = {};

        $scope.finish = function () {
            cmbFacebook.createPurchase($scope.purchase)
                .then(function () {
                    history.back();
                });
        }
    })

    .controller('EditPurchaseController', function ($scope, cmbFacebook, $stateParams, $ionicPopup) {
        $scope.title = 'Edit Purchase';

        $scope.finish = function () {
            cmbFacebook.updatePurchase($stateParams.purchase_id, $scope.purchase)
                .then(function () {
                    history.back();
                });
        }

        $scope.delete_it = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'IT CAN\'T BE UNDONE',
                template: 'Are you sure you want to remove this purchase?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    cmbFacebook.deletePurchase($stateParams.purchase_id)
                        .then(function () {
                            history.back();
                        });
                }
            });
        }
    });