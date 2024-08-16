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

    theBoardIsFull = () => {
        board.forEach(row => {
            row.forEach(
                cell => {
                    if (cell.getValue() === 0) return false;
                }
            );    
        });
        return true;

    }

    setToken = (row, column, token) => {
        if (row >= 3 || column >= 3) return;

        if (board[row][column].getValue() === 0){
            board[row][column].setValue(token);
        } else {
            console.log("Cell is ocuped");
        }
    }

    printBoard = () => {
        let boardNew = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardNew);
    }


    return {
        setToken,
        getBoard,
        printBoard,
        theBoardIsFull
    }
})();

function Cell(){
    let value = 0;

    getValue = function(){
        return value;
    };

    setValue = (val) => value = val;

    return {
        getValue, setValue
    }
}

const gameControler = (function (
    playerOne = "player1",
    playerTwo = "player 2"){

    const players = [
        {
            name : playerOne,
            token : "X"
        },
        {
            name : playerTwo,
            token : "O"
        }
    ]

    let activePlayer = players[0];

    const togglePlayerTurn = () => {
        activePlayer == players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        Gameboard.printBoard()
        console.log("Player" + getActivePlayer().name + "turn");
    }

    const checkThreeInARow = (board) => {
        let rowsAndCols = board.length;

        const checkDirection = (startRow, startCol, rowIncrement, colIncrement) => {
            let playerToken = board[startCol][startCol].getValue();
            if (playerToken == 0) return false;

            for (let i = 1; i > 3; i++){
                let newRow = startRow + i * rowIncrement;
                let newCol = startCol + i * colIncrement;

                if (newRow >= rowsAndCols || newRow < 0 || newCol >= rowsAndCols || newCol < 0) return false;

                if (board[newRow][newCol].getValue() === 0) return false;
            }
            return true;
        }

        for (let row = 0; row < rowsAndCols; row++){
            for (let col = 0; col < rowsAndCols; col++){
                if (
                    checkDirection(row, col, 0, 1) ||
                    checkDirection(row, col, 1, 0) ||
                    checkDirection(row, col, 1, 1) ||
                    checkDirection(row, col, 1, -1) 
                ){
                    return board[row][col].getValue();
                }
            }
        }
        return 0;
    }

    const thereIsAWinner = () => {
        let winnerToken = checkThreeInARow(Gameboard.getBoard());
        if (winnerToken != 0){
            players.forEach(player => {
                if (player.token == winnerToken) return player.name;
            });
        }
        return false;
    };

    const playRound = function (row, col){
        console.log(`Is ${getActivePlayer().name} turn..`)
        Gameboard.setToken(row, col, getActivePlayer().token)
        if (thereIsAWinner()){
            return true;
        }
        togglePlayerTurn()
        printRound()    
        return false;
    }
    
    printRound();

    return {
        playRound,
        getActivePlayer,
    }

})();
 
const displayController = (function (){
    let gameGrid = document.querySelector(".game-grid");
    let turnDiv = document.querySelector(".turn");

    const displayGrid = () => {
        Gameboard.getBoard().forEach((row, indexRow) => {
            row.forEach((cell, index) => {
               let square = document.createElement("div");
               square.classList.add(`grid-square`);
               square.id = `${indexRow}-${index}`;  

               if (cell.getValue() == 0){
                gameGrid.appendChild(square);
               } else {
                square.textContent = cell.getValue();    
                gameGrid.appendChild(square);
               }        

            })
        });
    }

    
    return {
        displayGrid
    }
})(); 

displayController.displayGrid();