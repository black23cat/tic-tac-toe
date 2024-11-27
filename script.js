// Module patter reference from https://www.ayweb.dev/blog/building-a-house-from-the-inside-out

function Gameboard(){
  //Create 3x3 2d board
  //Each square on board hold Cell()
  //Expose markCell method to mark selected cell
  const board = [];
  const generateBoard = () => {
    for(let i = 0; i < 9; i++){
      board[i] = Cell();
    }    
  }
  generateBoard();

  // Get 2d board
  const getBoard = () => board;

  const markCell = (index, marker) => {
    // Mark cell with player marker
    board[index].playerMarker(marker);
  }

  // Render board that have marker on cell
  const printBoard = () => {
    const boardWithCellMarker = board.map((cell) => cell.getCellMarker());
    return boardWithCellMarker;
  };

  return {
    getBoard,
    markCell,
    printBoard,
    resetBoard: generateBoard
  }
}

/* Cell represent one "square" on the board 
  ""  = empty cell
  "x" = Player1 marker
  "o" = Player2 marker
*/
function Cell(){
  let marker = "";

  // Accept a player's marker to change the cell marker
  const playerMarker = (playerMarker) => {
    marker = playerMarker;
  };

  //retrieve current value of cell with closure
  const getCellMarker = () => marker;

  return{
    playerMarker,
    getCellMarker
  };
}

// Control the game flow, current game state and the game winner
function PlayGame(playerOneName, playerTwoName){
  const board = Gameboard();
  
  const players = [
    {
      name: playerOneName,
      marker: "x",
      score: 0
    },
    {
      name: playerTwoName,
      marker: "o",
      score: 0
    }
  ];

  let playerTurn = players[0];

  const switchPlayerTurn = () =>{
    playerTurn = playerTurn === players[0] ? players[1]: players[0];
  };

  const getPlayerTurn = () => playerTurn;

  const printNewRound = () => {
    board.printBoard();
    console.log(board.printBoard());
    console.log(`${getPlayerTurn().name}'s turn.`);
  };

  const playRound = (index) => {
    // Check for empty cell
    // If selected cell already have marker, exit program
    if(board.getBoard()[index].getCellMarker() !== ""){
      printNewRound();
      return;
    } else {
    board.markCell(index, getPlayerTurn().marker);
    if(getRoundWinner()){
      return;
    } else {
      switchPlayerTurn();
      printNewRound();
      }
    }
  }

  const getRoundWinner = () => {
    const currentMarker = getPlayerTurn().marker;

    // Get the index of current player marker
    const markerIndex = board.printBoard().reduce((acc, curr, index) => {
      if(curr === currentMarker){
        acc.push(index);
      }
      return acc;
    }, []);

    const emptyCells = board.printBoard().filter(value => value === "");

    const isWinning = (arr1, arr2) => {
      return arr2.every((el) => arr1.includes(el));
    };

    // Winning pattern
    /* If one of the player marker match the pattern
       That player win the round */ 
    const winPattern = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let winner = false;
    console.log(markerIndex);
    // Check if player marker match the winning condition
    for(let i = 0; i < winPattern.length; i++){
      if(isWinning(markerIndex, winPattern[i])){
        console.log(board.printBoard());
        alert(`${getPlayerTurn().name} win this round.`);
        getPlayerTurn().score++;
        console.log(`${players[0].name} score is ${players[0].score}`);
        console.log(`${players[1].name} score is ${players[1].score}`);
        board.resetBoard();
        winner =  true;
        break;
      }
    }

    // check for draw condition
    if(emptyCells.length === 0 && !winner){
      alert(`DRAW`);
      console.log(`${players[0].name} score is ${players[0].score}`);
      console.log(`${players[1].name} score is ${players[1].score}`);
      board.resetBoard();
    }

    // check for overall game winner
    if(getPlayerTurn().score === 3){
      alert(`${getPlayerTurn().name} has won the game!`);
      players.forEach(e => e.score = 0);
      playerTurn = players[0];
      board.resetBoard();
      return winner;
    }
  }

  // Get player name and score for ui
  const getPlayerName = () => players.map(el => el.name);
  const getPlayerScore = () => players.map(el => el.score);
  // Initial play game
  printNewRound();

  return{
    playRound,
    getPlayerTurn,
    getBoard: board.getBoard,
    getPlayerName,
    getPlayerScore

  }
}

function ScreenDisplay(){
  startGame();
  function startGame(){
    const form = document.querySelector("form");
    const startBtn = document.querySelector("#start-game");
    startBtn.addEventListener("click", startClickHandler);
  
    function startClickHandler(){
      let playerOneName = form.querySelector("#player-one").value;
      let playerTwoName = form.querySelector("#player-two").value;
      if(playerOneName === "") playerOneName = "Player One";
      if(playerTwoName === "") playerTwoName = "Player Two";
      const resetBtn = document.createElement("button");
      resetBtn.textContent = "Reset All";
      resetBtn.addEventListener("click", resetGame);
      document.querySelector("body").appendChild(resetBtn);

      form.style.display = "none";
      renderScreen(playerOneName, playerTwoName);
    }

    function resetGame(){
      location.reload();
    }
  }

  function renderScreen(p1, p2){  
    const game = PlayGame(p1, p2);
    const boardContainer = document.querySelector(".board-container");
    const boardDiv = document.querySelector(".board");
    const playerTurnDiv = document.querySelector(".turn");
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");
    boardDiv.style.backgroundColor = "black";
    boardContainer.style.display = "flex";
    
    const updateScreen = () => {
      boardDiv.textContent = "";
      p1Score.textContent = `${game.getPlayerName()[0]} Score :  ${game.getPlayerScore()[0]}` ;
      p2Score.textContent = `${game.getPlayerName()[1]} Score :  ${game.getPlayerScore()[1]}` ;
      const board = game.getBoard();
      const activePlayer = game.getPlayerTurn();

      function colorHover(e){
        activePlayer.marker === "x" ? 
        e.target.style.backgroundColor = "rgb(191, 236, 255)": 
        e.target.style.backgroundColor = "rgb(255, 204, 234)";
      }

      function resetBgColor(e){
        e.target.style.backgroundColor = "white";
      }

      playerTurnDiv.textContent = `${activePlayer.name}'s (${activePlayer.marker.toUpperCase()}) turn...`;
      board.forEach((cell, index) => {
        const cellBtn = document.createElement("div");
        cellBtn.classList.add("cell");
        cellBtn.dataset.cell = index;
        cellBtn.textContent = cell.getCellMarker().toUpperCase();
        cellBtn.addEventListener("mouseover", colorHover);
        cellBtn.addEventListener("mouseout", resetBgColor);
        boardDiv.appendChild(cellBtn);
      });
    }

    function clickHandlerBoard(e){
      const selectedCell = e.target.dataset.cell;
      console.log(selectedCell);
      if(!selectedCell) return;

      game.playRound(selectedCell);
      updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
  }
}

ScreenDisplay();