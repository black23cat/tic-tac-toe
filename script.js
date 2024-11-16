// Module patter reference from https://www.ayweb.dev/blog/building-a-house-from-the-inside-out

function Gameboard(){
  //Create 3x3 2d board
  //Each square on board hold Cell()
  //Expose markCell method to mark selected cell
  const board = [];
  for(let i = 0; i < 3; i++){
    board[i] = [];
    for(let j = 0; j < 3; j++){
      board[i].push(Cell());
    }
  }
  // Get 2d board
  const getBoard = () => board;

  const markCell = (row, col, marker) => {
    const availableCells = 
      board[row][col].getCellMarker() === "" ? true: false;
    
    // If cell is not available, exit program
    if(!availableCells) return false;

    // If selected cell is available
    // Mark cell with player marker
    board[row][col].playerMarker(marker);
    return true;
  }

  // Render board that have marker on cell
  const printBoard = () => {
    const boardWithCellMarker = board.map((row) => row.map((cell) => cell.getCellMarker()));
    console.log(boardWithCellMarker);
    return boardWithCellMarker;
  };

  return {
    getBoard,
    markCell,
    printBoard
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
function PlayGame(
  playerOneName = "P1",
  playerTwoName = "P2",
) {
  const board = Gameboard();
  
  const players = [
    {
      name: playerOneName,
      marker: "x"
    },
    {
      name: playerTwoName,
      marker: "o"
    }
  ];

  let playerTurn = players[0];

  const switchPlayerTurn = () =>{
    playerTurn = playerTurn === players[0] ? players[1]: players[0];
  };

  const getPlayerTurn = () => playerTurn;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getPlayerTurn().name}'s turn.`);
  };

  const playRound = (row, col) => {
    console.log(`Selecting ${getPlayerTurn().name}'s marker.`);
    const selectCell = board.markCell(row, col, getPlayerTurn().marker);

    // If selected cell already have marker, exit program
    if(!selectCell){
      console.log("There's already a marker.");
      printNewRound();
      return;
    }

    // Change player turn after player select cell
    switchPlayerTurn();
    printNewRound();
  }

  // Initial play game
  printNewRound();

  return{
    playRound,
    getPlayerTurn,
    getBoard: board.getBoard

  }

}

const game = PlayGame();