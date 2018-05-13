var peaceApp = angular.module('peaceApp', ['ui.utils']);

peaceApp.service('Countries', function($http) {

		this.getCountry = function(callback) {
			$http.get(
				'http://opendata.socrata.com/resource/2nwa-frvc.json'
			).success(function(data){
				callback(data)
			});
		}

});

peaceApp.controller("CountriesCtrl", function($scope, Countries) {
		$scope.wishCountries=[];
		$scope.listCountries=[];
		$scope.wishDates    =[];
		$scope.wishSectors  =[];
		$scope.qualLanguages=[];
		$scope.qualMedical  =[];
		$scope.qualSkills   =[];
		$scope.qualEducation=[];

		$scope.addWishCountries = function(wish) {
			if ($scope.wishCountries.indexOf(wish) > -1) 
				return;
			$scope.wishCountries.push(wish)
			console.log($scope.wishCountries)
		}

		$scope.removeWishCountries = function(wish) {
			if ($scope.wishCountries.indexOf(wish) === -1) 
				return;
			$scope.wishCountries.pop(wish)
			console.log($scope.wishCountries)
		}

		$scope.addWishDates = function(wish) {
			if ($scope.wishDates.indexOf(wish) > -1) 
				return;
			$scope.wishDates.push(wish)
			console.log($scope.wishDates)
		}

		$scope.addWishSectors = function(wish) {
			if ($scope.wishSectors.indexOf(wish) > -1) 
				return;
			$scope.wishSectors.push(wish)
			console.log($scope.wishSectors)
		}

		$scope.addQualLanguages = function(qual) {
			if ($scope.qualLanguages.indexOf(wish) > -1) 
				return;
			$scope.qualLanguages.push(qual)
			console.log($scope.qualLanguages)
		}

		$scope.addQualSkills = function(qual) {
			if ($scope.qualSkills.indexOf(wish) > -1) 
				return;
			$scope.qualSkills.push(qual)
			console.log($scope.qualSkills)
		}

		$scope.addQualEducation = function(qual) {
			if ($scope.qualEducation.indexOf(wish) > -1) 
				return;
			$scope.qualEducation.push(qual)
			console.log($scope.qualEducation)
		}

    Countries.getCountry(function(result){
			$scope.countries = result
		});
});

//peaceApp.controller("CountriesCtrl", function($scope, $http) {
//   $http.get('peace.json').success(function(data) {
//      $scope.countries = data;
//   })
//});

