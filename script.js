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
  // Render 2d board
  const getBoard = () => board;

  const markCell = (row, col, marker) => {
    // check if cell is not marked
    const availableCells = 
      (board[row][col].getCellMarker() !== "")? true: false;

    if(availableCells){
      board[row][col].playerMarker(marker)
      return true;
    } else { // if there's already mark on the cell, exit program with returned value
      return false;
    }
  }

  // Render board that have marker on cell
  const printBoard = () => {
    const boardWithCellMarker = board.map((row) => row.map((cell) => cell.getCellMarker()));
    console.log(boardWithCellMarker);
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
