var cellTemplate = jQuery.validator.format("<h1 class='token'>{0}</h1>");
var board;
var currentTurn = "player";
var playerMoved = false;
var turn = 0;
var playerToken = "X";
var computerToken = "O";
var playerTurn = "Your turn!!"
var computerTurn = "Computer's turn";

$(document).ready(function() {
  $(".cell").click(function(){
	if (currentTurn == "player") {
		var id = $(this).attr("id");
		var index = id.split("-")[1];
		board[parseInt(index)] = -1;  //player's cell is -1;
		drawCell($(this), playerToken);
		
		var winner = win(board);
		if (turn == 8 || winner.id != 0) {
			displayResult(winner);
			return;		
		}		
		turn++;

		setCurrentTurn("computer", computerTurn);
		setTimeout(function(){
			computerMove(board);
		}, 1000);	
	}
  });
  
  $("#start-btn").click(function(){
	if ($(this).attr("value") == "start") {
		startGame();
		$(this).html("Reset");
		$(this).attr("value", "reset");
		disableInput(true);
	} else if ($(this).attr("value") == "reset") {
		resetGame();
		$(this).html("Start");
		$(this).attr("value", "start");
		disableInput(false);
	}
  });
  
  $("input").click(function(){
	playerToken = $(this).attr("value");
	computerToken = (playerToken == "X" ? "O" : "X");
  });
});

function drawCell(obj, token) {
	if($.trim(obj.html()) == "")	
		obj.append(cellTemplate(token));
}

function clearCells() {
	$("#cell-0").html("");
	$("#cell-0").removeClass("cell-win");
	$("#cell-1").html("");
	$("#cell-1").removeClass("cell-win");
	$("#cell-2").html("");
	$("#cell-2").removeClass("cell-win");
	$("#cell-3").html("");
	$("#cell-3").removeClass("cell-win");
	$("#cell-4").html("");
	$("#cell-4").removeClass("cell-win");
	$("#cell-5").html("");
	$("#cell-5").removeClass("cell-win");
	$("#cell-6").html("");
	$("#cell-6").removeClass("cell-win");
	$("#cell-7").html("");
	$("#cell-7").removeClass("cell-win");
	$("#cell-8").html("");
	$("#cell-8").removeClass("cell-win");
}

function disableInput(val) {
	$("input").attr("disabled", val);
}

function startGame() {
	board = [0,0,0,0,0,0,0,0,0];
	turn = 0;

	var result = getRandomInt(1, 2);
	if (result == 1) {
		setCurrentTurn("computer", computerTurn);
		setTimeout(function(){
			computerMove(board);
		}, 1000);	
	} else
		setCurrentTurn("player", playerTurn);
}

function resetGame() {
	clearCells();
	setCurrentTurn(undefined, 'Press "Start" button to play...');
}

function displayResult(winner) {
	var line = winner.line;
	for (var i = 0; i < line.length; i++) {
		$("#cell-" + line[i]).addClass("cell-win");
	}
	
	currentTurn = undefined;
	
	switch (winner.id) {
		case 1:
			$("#message").html("You lost!!");
			break;
		case -1:
			$("#message").html("You win!!");
			break;
		case 0:
			$("#message").html("It was a draw...");
			break;
	}
	
	$("#start-btn").attr("disabled", true);
	setTimeout(function(){
		clearCells();
		setCurrentTurn(undefined, "");
		startGame();
		$("#start-btn").attr("disabled", false);
	}, 3000);	
}

function setCurrentTurn(turn, message) {
	currentTurn = turn;
	$("#message").html(message);
}

function win(board) {
    //determines if a player has won, returns 0 otherwise.
    var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	var winner = {
		id: 0,
		line: []
	};
	
    for(var i = 0; i < 8; i++) {
        if(board[wins[i][0]] != 0 &&
           board[wins[i][0]] == board[wins[i][1]] &&
           board[wins[i][0]] == board[wins[i][2]]) {
				winner.id = board[wins[i][2]];
				winner.line = wins[i];
				break;
		   }
    }
	
    return winner;
}

function minimax(board, player) {
    
    var winner = win(board);
    if(winner.id != 0) 
		return winner.id * player;

    var move = -1;
    var score = -2;

    for(var i = 0; i < 9; i++) {
        if(board[i] == 0) {
            board[i] = player;
            var thisScore = -1 * minimax(board, player * -1);
            if(thisScore > score) {
                score = thisScore;
                move = i;
            }
            board[i] = 0;
        }
    }
	
    if(move == -1) 
		return 0;
	
    return score;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computerMove(board) {
	var move;
	if (turn > 0) {
	
		move = -1;
		var score = -2;

		for(var i = 0; i < 9; i++) {
			if(board[i] == 0) {
				board[i] = 1;
				var tempScore = -1 * minimax(board, -1);
				board[i] = 0;
				if(tempScore > score) {
					score = tempScore;
					move = i;
				}
			}
		}
    } else {
		move = getRandomInt(0, 8); //if computer start playing first then just get a random move to start.
	}
	
    board[move] = 1; //computer's cell is 1
	drawCell($("#cell-" + move), computerToken);
	
	var winner = win(board);
	if (turn == 8 || winner.id != 0) {
		displayResult(winner);
		return;
	}
	
	turn++;

	setCurrentTurn("player", playerTurn);
}