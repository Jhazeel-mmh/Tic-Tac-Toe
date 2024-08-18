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
        let isFull = true;
        board.forEach(row => {
            row.forEach(
                cell => {
                    if (cell.getValue() === 0){
                        isFull = false;
                    };
                }
            );    
        });
        return isFull;

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
            let playerToken = board[startRow][startCol].getValue();
            if (playerToken == 0) return false;

            for (let i = 1; i < 3; i++){
                let newRow = startRow + i * rowIncrement;
                let newCol = startCol + i * colIncrement;

                if (newRow >= rowsAndCols || newRow < 0 || newCol >= rowsAndCols || newCol < 0) return false;

                if (board[newRow][newCol].getValue() !== playerToken) return false;
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
            for (p of players){
                if (p.token == winnerToken) return true;
            }
        }
        return false;
    };

    const isTheGameOver = () => {
        if (thereIsAWinner()){
            return "there is a winner";
        }

        if (Gameboard.theBoardIsFull()){
            return "the board is full";
        }
    };

    const playRound = function (row, col){
        console.log(`Is ${getActivePlayer().name} turn..`)
        Gameboard.setToken(row, col, getActivePlayer().token)
        if (isTheGameOver()){
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
        isTheGameOver
    }

})();
 
const displayController = (function (){
    let gameGrid = document.querySelector(".game-grid");
    let turnDiv = document.querySelector(".turn");

    const displayGrid = () => {
        gameGrid.textContent = "";
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
    };

    const displayGame = () => {
        turnDiv.textContent = `${gameControler.getActivePlayer().name} is your turn...`;
        displayGrid();
    };


    // Display the winner name in the turn section and generate a button that resets the Gameboard (create that closure in the Gameboard IFFE) and displays the game
    const displayResetGame = (winner = false) => {
        if (winner) turnDiv.textContent = `${gameControler.getActivePlayer().name} is the winner`;
        if (!winner) turnDiv.textContent = `The board is full`;
        let resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.textContent = "Reset Game";
        turnDiv.appendChild(resetBtn);
        resetBtn.addEventListener("click", resetGame);

    };


    const handleClick = (event) => {
        let target = event.target;
        if (target.className !== "grid-square") return;

        let [row, col] = target.id.split("-");

        // verify if there is a winner
        gameControler.playRound(row, col);
        displayGame();
        if (gameControler.isTheGameOver()){
            if (gameControler.isTheGameOver() === "there is a winner") return displayResetGame(true);
            if (gameControler.isTheGameOver() === "the board is full") return displayResetGame();
        }
    }

    return {
        displayGame, handleClick
    }
})(); 

displayController.displayGame();
document.querySelector(".game-grid").addEventListener("click", displayController.handleClick );