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
                        templateUrl: "templates/monthly-goals.html",
                        controller: "MonthlyGoalController"
                    }
                }
            })
            .state('app.monthlygoals-new', {
                url: "/monthly-goals/new",
                views: {
                    'menuContent': {
                        templateUrl: "templates/monthly-goal-new.html",
                        controller: "MonthlyGoalNewController"
                    }
                }
            })
            .state('app.monthlygoals-new-step-2', {
                url: "/monthly-goals/new-step-2",
                views: {
                    'menuContent': {
                        templateUrl: "templates/monthly-goal-new-step-2.html",
                        controller: "MonthlyGoalNewController"
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
    })

    .factory(
    "transformRequestAsFormPost",
    function () {

        // I prepare the request data for the form post.
        function transformRequest(data) {
            return(serializeData(data));
        }


        // Return the factory value.
        return( transformRequest );


        // ---
        // PRVIATE METHODS.
        // ---


        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData(data) {

            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {

                return( ( data == null ) ? "" : data.toString() );

            }

            var buffer = [];

            // Serialize each key in the object.
            for (var name in data) {

                if (!data.hasOwnProperty(name)) {

                    continue;

                }

                var value = data[ name ];

                buffer.push(
                    encodeURIComponent(name) +
                        "=" +
                        encodeURIComponent(( value == null ) ? "" : value)
                );

            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                    .join("&")
                    .replace(/%20/g, "+")
                ;

            return( source );

        }

    });

