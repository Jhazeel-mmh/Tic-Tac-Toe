const Gameboard = (function (){
    let rowsAndCols = 3;
    let board = [];

    for (let i = 0; i < rowsAndCols; i++){
        board[i] = []
        for (let j = 0; j < rowsAndCols; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const createNewBoard = () => {
        for (let i = 0; i < rowsAndCols; i++){
            board[i] = []
            for (let j = 0; j < rowsAndCols; j++){
                board[i].push(Cell());
            }
        }
    }

    const theBoardIsFull = () => {
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

    const setToken = (row, column, token) => {
        if (row >= 3 || column >= 3) return;

        if (board[row][column].getValue() === 0){
            board[row][column].setValue(token);
        } else {
            console.log("Cell is ocuped");
        }
    }

    const printBoard = () => {
        let boardNew = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardNew);
    }


    return {
        setToken,
        getBoard,
        printBoard,
        theBoardIsFull,
        createNewBoard
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

const gameControler = (function (){

    let playerOne = "player1";
    let playerTwo = "player 2";

    const players = [
        {
            name : playerOne,
            token : "X",
            score: 0
        },
        {
            name : playerTwo,
            token : "O",
            score: 0
        }
    ]

    const setPlayersName = (player1, player2) => {
        players[0].name = player1;
        players[1].name = player2;
    };

    const getPlayersData = () =>  players;

    const addScoreToPlayerbyName = (name) => {
        for(player of players){
            if (player.name == name){
                player.score++;
            }
        }

    };

    let activePlayer = players[0];

    const togglePlayerTurn = () => {
        activePlayer == players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const resetActivePlayer = () => activePlayer = players[0];

    const printRound = () => {
        Gameboard.printBoard()
        console.log("Player" + getActivePlayer().name + "turn");
    }
    
    let coordenades = [];

    const setThreeInARowPositions = (startRow, startCol, rowIncrement, colIncrement) => {
        coordenades = [];
        coordenades.push(`${startRow}-${startCol}`);

        for (let i = 1; i < 3; i++){
            let newRow = startRow + i * rowIncrement;
            let newCol = startCol + i * colIncrement;
            coordenades.push(`${newRow}-${newCol}`);
        }
    };

    const getThreeInARowPositions = () => coordenades;

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
            setThreeInARowPositions(startRow, startCol, rowIncrement, colIncrement);
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
                if (p.token == winnerToken){ 
                    return true
                }
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
        isTheGameOver,
        resetActivePlayer,
        getThreeInARowPositions,
        setPlayersName,
        getPlayersData,
        addScoreToPlayerbyName
    }

})();
 
const displayController = (function (){
    let gameGrid = document.querySelector(".game-grid");
    let turnDiv = document.querySelector(".turn");

    let sideOnePlayer = document.querySelector(".player-left");
    let sideTwoPlayer = document.querySelector(".player-right");

    const displayDataOfPlayers = () => {
        let playersData = gameControler.getPlayersData(); 
        sideOnePlayer.textContent = "";
        sideTwoPlayer.textContent = "";

        let playerOneName = document.createElement("p");
        let playerOneScore = document.createElement("p");
        playerOneName.classList.add("player-name");
        playerOneScore.classList.add("player-score");

        let playerTwoName = document.createElement("p");
        let playerTwoScore = document.createElement("p");
        playerTwoName.classList.add("player-name");
        playerTwoScore.classList.add("player-score");

        playerOneName.textContent = playersData[0].name;
        playerOneScore.textContent = "Score: " + playersData[0].score;
        sideOnePlayer.appendChild(playerOneName);
        sideOnePlayer.appendChild(playerOneScore);

        playerTwoName.textContent = playersData[1].name;
        playerTwoScore.textContent = "Score: " + playersData[1].score;
        sideTwoPlayer.appendChild(playerTwoName);
        sideTwoPlayer.appendChild(playerTwoScore)


    };

    const displayGrid = () => {
        gameGrid.textContent = "";
        Gameboard.getBoard().forEach((row, indexRow) => {
            row.forEach((cell, index) => {
               let square = document.createElement("button");
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
        displayDataOfPlayers();
    };

    const resetGame = () => {
        gameControler.resetActivePlayer();
        Gameboard.createNewBoard();
        displayController.displayGame();
    };

    // Display the winner name in the turn section and generate a button that resets the Gameboard (create that closure in the Gameboard IFFE) and displays the game
    const displayResetGame = (winner = false) => {
        if (winner) turnDiv.textContent = `${gameControler.getActivePlayer().name} is the winner`;
        if (!winner) turnDiv.textContent = `The board is full`;
        let resetBtn = document.createElement("button");
        resetBtn.id = "resetBtn";
        resetBtn.type = "button";
        resetBtn.textContent = "Reset Game";
        resetBtn.addEventListener("click", resetGame);
        turnDiv.appendChild(resetBtn);
    };

    const styleRowWinner = () => {
        let coordenades = gameControler.getThreeInARowPositions();
        let gridSquares = document.querySelectorAll(".grid-square");
        gridSquares.forEach(square => {
            if (coordenades.includes(square.id)){
                square.classList.add("grid-square-winner");
            };
        });
    };


    const handleClick = (event) => {
        let target = event.target;
        if (target.className !== "grid-square") return;
        if (target.textContent) return;
        if (gameControler.isTheGameOver()) return;

        let [row, col] = target.id.split("-");


        // verify if there is a winner
        gameControler.playRound(row, col);
        displayGame();
        if (gameControler.isTheGameOver()){
            if (gameControler.isTheGameOver() === "there is a winner"){
                gameControler.addScoreToPlayerbyName(gameControler.getActivePlayer().name);
                displayDataOfPlayers();
                styleRowWinner();
                return displayResetGame(true)
            };
            if (gameControler.isTheGameOver() === "the board is full") return displayResetGame();
        }
    }

    return {
        displayGame, handleClick
    }
})(); 


let formNames = document.getElementById("form-names");
formNames.addEventListener("submit", (event) => {
    event.preventDefault();
    let formTarget = event.target;
    let playerOneName = document.querySelector("#player-one").value;
    let playerTwoName = document.querySelector("#player-two").value;
    gameControler.setPlayersName(playerOneName, playerTwoName);
    formTarget.style.display = "none";
    displayController.displayGame();

});


document.querySelector(".game-grid").addEventListener("click", displayController.handleClick );
