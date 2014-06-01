var peaceApp = angular.module('peaceApp', []);

// peaceApp.factory('Countries', function($http) {
//    var Countries = {};
//
//    Countries.list = $http.get(
//       'peace.json'
//    ).success(function(response) {
//       return response.data;
//    });
//
//    return Countries;
// });

peaceApp.controller("CountriesCtrl", function($scope, $http) {
   $http.get('peace.json').success(function(data) {
      $scope.countries = data;
   })
});

//    var Countries = {};
//
//    'http://opendata.socrata.com/resource/2nwa-frvc.json'
//    Countries.list = $http.get(
//       'peace.json'
//    ).success(function(response) {
//       return response.data;
//    });
//
//    return Countries;
// });

// function CountriesCtrl($scope, Countries) {
//    $scope.countries = Countries;
// }
