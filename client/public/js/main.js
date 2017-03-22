(function () {
    'use strict';
    console.log('here')
    var myApp = angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial', 'pickSelect'])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .accentPalette('orange');
        });
    myApp.controller('app.controller', Controller);

    // angular.module('pickSelect', []).directive('pickSelect', [pickSelectDirective]);

    function pickSelectDirective() {
        console.log('here')
        return {
            restrict: 'E',
            templateUrl: './pickSelect.html',
            scope: {},
            controller: PickSelectController,
            controllerAs: 'vm',
            bindToController: true
        }
    }


    Controller.$inject = ['$http', 'seasonData'];

    function Controller($http, seasonData) {
        var vm = this;
        // vm.games = $http.get('/scrape/season')
        //     .then(function handlePicks(response) {
        //         console.log(response)
        //         seasonData.init(response.data);
        //     })
    }
    PickSelectController.$inject = ['$http'];

    function PickSelectController($http) {
        var vm = this;
        vm.values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

        vm.dupError = {
            isDup: false,
            num: 0
        };

        vm.update = function () {
            vm.points.forEach(function (point) {
                point.points = 0;
            })
            checkDup();
            total();
        }

        vm.points = [
            {
                name: 'mom',
                points: 0,
                season: 1308
                }, {
                name: 'shoe',
                points: 0,
                season: 1320
                }, {
                name: 'lance',
                points: 0,
                season: 1349
                        }];
        //        var picks = $http.get('/scrape/shoeAnalysis')
        //            .then(function handlePicks(req, res, err) {
        //                vm.picks = req.data;
        //                vm.update();
        //                console.log(vm.picks)
        //            })


        vm.games = $http.get('/scrape/season')
            .then(function handlePicks(req, res, err) {
                console.log(req, res, err)
            })
        console.log(vm.games)
        vm.difference = function (pick) {
            var diff = pick.mom.weight - pick.sharty.weight;
            var abDiff = Math.abs(diff)
            console.log(abDiff)
            if (abDiff > 5) {
                pick.class = "md-warn md-hue-3"
            } else if (abDiff > 5) {
                pick.class = "md-warn md-hue-2"
            } else {
                pick.class = "md-warn md-hue-1"
            }
            return diff;
        };

        vm.class = function (pick) {
            var diff = pick.mom.weight - pick.sharty.weight;
            var abDiff = Math.abs(diff)
            console.log(abDiff)
            if (abDiff > 5) {
                return "md-accent md-hue-2"
            } else if (abDiff > 1) {
                return "md-primary md-hue-2"

            } else if (abDiff > 0) {
                return "md-accent md-hue-1"
            } else {
                return "md-primary md-hue-1"
            }
        };


        function total() {
            var total = vm.picks.reduce(function (a, b) {
                if (b.win) {
                    return a + parseInt(b.mom.weight)
                }
                return a;
            }, 0)
            var shartyTotal = vm.picks.reduce(function (a, b) {
                if (b.sharty.pick === b.mom.pick) {
                    if (b.win) {
                        return a + parseInt(b.sharty.weight);
                    }
                }
                if (b.sharty.pick !== b.mom.pick) {
                    if (!b.win) {
                        return a + parseInt(b.sharty.weight);
                    }
                }
                return a;
            }, 0)
            var lanceTotal = vm.picks.reduce(function (a, b) {
                if (b.lance.pick === b.mom.pick) {
                    if (b.win) {
                        return a + parseInt(b.lance.weight);
                    }
                }
                if (b.lance.pick !== b.mom.pick) {
                    if (!b.win) {
                        return a + parseInt(b.lance.weight);
                    }
                }
                return a;
            }, 0)

            vm.points[0].points = total;
            vm.points[0].season = 1308 + total;
            vm.points[1].points = shartyTotal;
            vm.points[1].season = 1320 + shartyTotal;
            vm.points[2].points = lanceTotal;
            vm.points[2].season = 1349 + lanceTotal;
            vm.momWins = vm.points[0].season > vm.points[1].season;
        }

        function checkDup() {
            vm.dups = [];
            vm.dupError.isDup = false;
            vm.picks.forEach(function (pick) {
                console.log(vm.dups.indexOf(pick.mom.weight));
                if (vm.dups.indexOf(pick.mom.weight) !== -1) {
                    vm.dupError.isDup = true;
                    vm.dupError.num = pick.mom.weight;
                }

                vm.dups.push(parseInt(pick.mom.weight));
            })
            console.log(vm.dupError)
        }
    }
})();
