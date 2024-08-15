const Gameboard = (function (){
    let rowsAndCols = 3;
    let board = [];

    for (let i = 0; i < rowsAndCols; i++){
        board[i] = []
        for (let j = 0; j < rowsAndCols; j++){
            board[i].push(Cell());
        }
    }

    getBoard = () => board;

    setToken = (row, column, token) => {
        if (board[row][column].getValue() === 0){
            board[row][column].setValue(token);
        } else {
            console.log("Cell is ocuped");
        }
    }

    printBoard = () => {
        boardWithValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithValues);
    }


    return {
        setToken,
        getBoard
    }
})();