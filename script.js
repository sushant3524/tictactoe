var origBoard;
const huplayer='0';
const aiplayer='X';
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
]

const cells=document.querySelectorAll('.cell');
startGame();

function startGame(){
	document.querySelector(".endgame").style.display="none";
	origBoard=Array.from(Array(9).keys());
	for(var i=0;i<cells.length;i++)
	{
		cells[i].innerText='';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
		
	}
}

function turnClick(square) {
	if(typeof origBoard[square.target.id]=='number') {
		turn(square.target.id,huplayer)
		if(!checkWin(origBoard, huplayer) && !checkTie(origBoard)) turn(bestSpot(), aiplayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId]=player;
	document.getElementById(squareId).innerText=player;
	let gameWon=checkWin(origBoard, player)
	if(gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays=board.reduce((a,e,i)=>(e===player)?a.concat(i):a,[]);
	let gameWon=null;
	for (let [index, win] of winCombos.entries()) {
		if(win.every(elem=>plays.indexOf(elem)>-1)) {
			gameWon={index:index, player:player}; //jj
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor=
		gameWon.player==huplayer?"blue":"red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click',turnClick,false);
	}
	declareWinner(gameWon.player==huplayer? "You Win!":"You Suck!")
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display="block";
	document.querySelector(".endgame .text").innerText=who;
	
}

function emptySquares(nwboard) {
	return nwboard.filter(s=>typeof s=='number');
}

function bestSpot() {
	return minimax(origBoard, aiplayer).index;
}

function checkTie(origBoard) {
	if (emptySquares(origBoard).length==0){
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor="green";
			cells[i].removeEventListener('click',turnClick,false);
		}
		declareWinner("Game Tied!")
		return true;
	}
	return false;
}

function minimax(newboard, player) {
	var availSpots=emptySquares(newboard);
	if(checkWin(newboard, huplayer)){
		return {score: -10};
	}
	else if(checkWin(newboard, aiplayer)){
		return {score: 10};
	}
	else if(availSpots.length===0)
	{
		return {score: 0};
	}
	var moves=[];
	for (var i = 0; i < availSpots.length; i++) {
		var move={};
		move.index=newboard[availSpots[i]];
		newboard[availSpots[i]]=player;
		if(player==aiplayer)
		{
			var result=minimax(newboard, huplayer);
			move.score=result.score;
		}
		else{
			var result=minimax(newboard, aiplayer);
			move.score=result.score;
		}
		newboard[availSpots[i]]=move.index;
		moves.push(move);
	}
	var bestmv;
	var bestsc;
	if(player===aiplayer)
	{
		bestsc=-100000;
		for (var i = 0; i < moves.length; i++) {
			if(bestsc<moves[i].score)
			{
				bestsc=moves[i].score;
				bestmv=i;
			}

		}
	}
	else
	{
		bestsc=100000;
		for (var i = 0; i < moves.length; i++) {
			if(bestsc>moves[i].score)
			{
				bestsc=moves[i].score;
				bestmv=i;
			}

		}	
	}
	return moves[bestmv];

}