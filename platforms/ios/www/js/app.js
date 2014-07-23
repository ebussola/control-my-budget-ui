// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.mydailybudgetmonthlygoals', {
                url: "/my-daily-budget/monthly-goals",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my-daily-budget-show-monthly-goals.html",
                        controller: 'MyDailyBudgetMonthlyGoalsController'
                    }
                }
            })

            .state('app.mydailybudget', {
                url: "/my-daily-budget/:monthly_goal_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/my-daily-budget.html",
                        controller: 'MyDailyBudgetController'
                    }
                }
            })

            .state('app.monthlygoals', {
                url: "/monthly-goals",
                views: {
                    'menuContent': {
                        templateUrl: "templates/monthly-goals.html"
                    }
                }
            })
            .state('app.purchases', {
                url: "/purchases",
                views: {
                    'menuContent': {
                        templateUrl: "templates/purchases.html"
//                        controller: 'PlaylistsCtrl'
                    }
                }
            });

//            .state('app.single', {
//                url: "/playlists/:playlistId",
//                views: {
//                    'menuContent': {
//                        templateUrl: "templates/playlist.html",
//                        controller: 'PlaylistCtrl'
//                    }
//                }
//            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/my-daily-budget/monthly-goals');
    });

