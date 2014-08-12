// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'facebook'])

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

            .state('app.monthlygoals-edit', {
                url: '/monthly-goals/:monthly_goal_id/edit',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/monthly-goal-new.html',
                        controller: 'MonthlyGoalNewController'
                    }
                }
            })

            .state('app.purchases-months', {
                url: "/purchases",
                views: {
                    'menuContent': {
                        templateUrl: "templates/purchases-months.html",
                        controller: 'ListMonthPurchaseController'
                    }
                }
            })

            .state('app.purchases', {
                url: "/purchases/:year/:month",
                views: {
                    'menuContent': {
                        templateUrl: "templates/purchases.html",
                        controller: 'ListPurchaseController'
                    }
                }
            })

            .state('app.purchases-add', {
                url: "/purchase/new",
                views: {
                    'menuContent': {
                        templateUrl: "templates/purchase-form.html",
                        controller: 'NewPurchaseController'
                    }
                }
            })

            .state('app.purchases-edit', {
                url: "/purchase/:purchase_id/edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/purchase-form.html",
                        controller: 'EditPurchaseController'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/my-daily-budget/monthly-goals');
    })

    .factory("transformRequestAsFormPost", function () {

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

    })

    .factory('cmbFacebook', function ($http, $q, transformRequestAsFormPost) {
        var deferred = $q.defer();

        return {
            api_domain: 'cmb.ebussola.com',

            setAccessToken: function (access_token) {
                deferred.resolve(access_token);
            },

            getAccessToken: function () {
                return deferred.promise;
            },

            getMonthlyGoals: function () {
                return this.getAccessToken().then(function (access_token) {
                    return $http.get('http://' + this.api_domain + '/api.php/goals?access_token=' + access_token);
                });
            },

            getMonthlyGoal: function (monthly_goal_id) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.get('http://' + this.api_domain + '/api.php/goal/' + monthly_goal_id + '?access_token=' + access_token);
                });
            },

            createMonthlyGoal: function (monthly_goal) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.post(
                        'http://' + this.api_domain + '/api.php/goals?access_token=' + access_token,
                        {
                            monthly_goal: JSON.stringify(monthly_goal)
                        }, {
                            transformRequest: transformRequestAsFormPost,
                            headers: {
                                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
                            }
                        }
                    );
                });
            },

            updateMonthlyGoal: function (monthly_goal_id, monthly_goal) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.post(
                        'http://' + this.api_domain + '/api.php/goal/' + monthly_goal_id + '?access_token=' + access_token,
                        {
                            monthly_goal: JSON.stringify(monthly_goal)
                        }, {
                            transformRequest: transformRequestAsFormPost,
                            headers: {
                                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
                            }
                        }
                    );
                });
            },

            deleteMonthlyGoal: function (monthly_goal_id) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.delete('http://' + this.api_domain + '/api.php/goal/' + monthly_goal_id + '?access_token=' + access_token)
                });
            },

            getMyDailyBudget: function (monthly_goal_id) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.get('http://' + this.api_domain + '/api.php/my-daily-budget/' + monthly_goal_id + '?access_token=' + access_token);
                });
            },

            getPurchases: function (month, year) {
                return this.getAccessToken().then(function (access_token) {
                    month = parseInt(month) - 1; // minus 1 because for javascript, January is 0
                    year = parseInt(year);
                    var date = Date.today().set({month: month, year: year});
                    var month_lenght = new Date(year, month, 0).getDate();

                    return $http.get('http://' + this.api_domain + '/api.php/purchases/'
                        + date.toString('yyyy-MM-01') + '/' + date.toString('yyyy-MM-') + month_lenght
                        + '?access_token=' + access_token)
                });
            },

            createPurchase: function (purchase) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.post(
                        'http://' + this.api_domain + '/api.php/purchases?access_token=' + access_token,
                        purchase
                    );
                });
            },

            updatePurchase: function (purchase_id, purchase) {
                return this.getAccessToken().then(function (access_token) {
                    return $http.post(
                        'http://' + this.api_domain + '/api.php/purchase/' + purchase_id + '?access_token=' + access_token,
                        purchase
                    );
                });
            },

            deletePurchase: function (purchase_id) {
                return this.getAccessToken().then(function (access_token) {
                    $http.delete('http://' + this.api_domain + '/api.php/purchase/' + purchase_id + '?access_token=' + access_token)
                });
            }
        }
    })

    .config(function (FacebookProvider, cmbFacebookProvider) {
        // Set your appId through the setAppId method or
        // use the shortcut in the initialize method directly.
        FacebookProvider.init('1446089528999129');
    });