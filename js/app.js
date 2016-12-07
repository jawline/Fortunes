'use strict';

/* App Module */

var game = angular.module('game', [ 'ngRoute' ]);

//Load audio files
var correct = new Audio('/media/correct.ogg');
var wrong = new Audio('/media/wrong.mp3');
var buz1 = new Audio('/media/hero-baby.ogg');
var buz2 = new Audio('/media/trololololol.ogg');


var keyPressHandler = function (e) {
    if(e.key == "x") {
        wrong.play();
        return false;
    }else if(e.key == "c"){
        correct.play();
        return false;
    }else if(e.key == "n"){
        buz1.play();
        return false;
    }else if(e.key == "m"){
        buz2.play();
        return false;
    }
}



game.controller('Round', function($scope, $routeParams) {
	var lid = parseInt($routeParams.id);

	//Generate the next panel URI
	if (lid + 1 >= RQuestions.length) {
		$scope.nexturi = "#!/qround/0";
	} else {
		$scope.nexturi = "#!/round/" + (lid + 1);
	}

	$scope.question = RQuestions[lid];
	$scope.answers = []; //empty arrays
	$scope.scores = [];
    $scope.score = 0;

    $scope.isRevealed = function(key) {
    	return $scope.answers[key] === $scope.question.answers[key];
    }

	$scope.reveal = function(key) {
		if (!$scope.isRevealed(key) && key >= 0 && key < $scope.question.answers.length) {
			$scope.answers[key] = $scope.question.answers[key];
			$scope.scores[key] = $scope.question.scores[key];
            correct.play();
            $scope.score += parseInt($scope.question.scores[key]);
		}
		$scope.$apply();
	}

    //NB: music.play() will not replay a sound bite if it is already started
	document.onkeypress = function (e) {
    	e = e || window.event;
        keyPressHandler(e);

    	// use e.keyCode
    	var lKey = parseInt(e.key);
    	lKey = lKey == 0 ? 10 : lKey;
    	$scope.reveal(parseInt(e.key) - 1);
	};

	for (var i = 0; i < $scope.question.answers.length; i++) {
		$scope.answers[i] = "___________";
		$scope.scores[i] = "__";
	}
});

game.controller('Done', function($scope, $routeParams) {});


game.controller('QuickRound', function($scope, $routeParams) {
	//var lid = parseInt($routeParams.id);
    $scope.nexturi = "#!/done/";

	//$scope.question = QQuestions[lid];
    $scope.question = QAnswers;

	//$scope.answers = $scope.question[0].answers;
	//$scope.scores = $scope.question[0].scores;
    $scope.l_score = 0;
    $scope.r_score = 0;

    $scope.l_answers = $scope.question[0].answers;
    $scope.r_answers = $scope.question[1].answers;

	$scope.l_scores = $scope.question[0].scores;
	$scope.r_scores = $scope.question[1].scores;



    $scope.isRevealed = function(list, list2, key) {
    	return list[key] === list2[key];
    }

	$scope.reveal = function(key) {
        if(key  < 100){
            if (!$scope.isRevealed($scope.l_answers, key) && key >= 0 && key < $scope.l_answers.length) {
                $scope.l_answers[key] = $scope.l_answers[key];
                $scope.l_scores[key] = $scope.l_scores[key];
                correct.play();
                $scope.l_score += parseInt($scope.l_scores[key]);
            }
        }else{
            key = key % 100;
            if (!$scope.isRevealed($scope.r_answers, key) && key >= 0 && key < $scope.question.answers.length) {
                $scope.r_answers[key] = $scope.r_answers[key];
                $scope.r_scores[key] = $scope.r_scores[key];
                correct.play();
                $scope.rscore += parseInt($scope.r_scores[key]);
            }
        }
		$scope.$apply();
	}

    //NB: music.play() will not replay a sound bite if it is already started
	document.onkeypress = function (e) {
    	e = e || window.event;
        keyPressHandler(e);

        var lKey = parseInt(e.key);
        if(e.ctrlKey){
            //advance right answers
            lKey = lKey == 100 ? 110 : lKey + 100;
        } else {
            //advance left answers
            lKey = lKey == 0 ? 10 : lKey;
        }

    	$scope.reveal(lKey - 1);
	};

	$scope.l_answers = [];
	$scope.l_scores = [];
	$scope.r_answers = [];
	$scope.r_scores = [];

	for (var i = 0; i < $scope.l_answers.length; i++) {
		$scope.l_answers[i] = "___________";
		$scope.l_scores[i] = "__";
    }
	for (var i = 0; i < $scope.r_answers.length; i++) {
		$scope.r_answers[i] = "___________";
		$scope.r_scores[i] = "__";
	}
});



game.config([ '$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'partials/front.html'
	}).when('/round/:id', {
		controller: 'Round',
		templateUrl: 'partials/round.html'
	}).when('/qround', {
		controller: 'QuickRound',
		templateUrl: 'partials/quick-round.html'
	}).when('/done', {
		controller: 'Done',
		templateUrl: 'partials/done.html'
	});

}]).run(function ($rootScope) {});
