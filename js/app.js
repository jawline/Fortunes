'use strict';

/* App Module */

var game = angular.module('game', [ 'ngRoute' ]);

game.controller('Round', function($scope, $routeParams) {
	var lid = parseInt($routeParams.id);

	//Generate the next panel URI
	if (lid + 1 >= RQuestions.length) {
		$scope.nexturi = "#!/done/";
	} else {
		$scope.nexturi = "#!/round/" + (lid + 1);
	}

	$scope.question = RQuestions[lid];

	$scope.answers = $scope.question.answers;
	$scope.scores = $scope.question.scores;

	$scope.reveal = function(key) {
		if (key >= 0 && key < $scope.question.answers.length) {
			$scope.l_answers[key] = $scope.answers[key];
			$scope.l_scores[key] = $scope.scores[key];
		}
		$scope.$apply();
	}

	document.onkeypress = function (e) {
    	e = e || window.event;
    	// use e.keyCode
    	var lKey = parseInt(e.key);
    	lKey = lKey == 0 ? 10 : lKey;
    	$scope.reveal(parseInt(e.key) - 1);
	};

	$scope.l_answers = [];
	$scope.l_scores = [];

	for (var i = 0; i < $scope.question.answers.length; i++) {
		$scope.l_answers[i] = "_______";
		$scope.l_scores[i] = "_";
	}
});

game.controller('Done', function($scope, $routeParams) {
});

game.config([ '$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'partials/front.html'
	}).when('/round/:id', {
		controller: 'Round',
		templateUrl: 'partials/round.html'
	}).when('/done', {
		controller: 'Done',
		templateUrl: 'partials/done.html'
	});

}]).run(function ($rootScope) {});
