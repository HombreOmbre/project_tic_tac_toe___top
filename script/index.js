const Player = (name, mark) => {
    let  score = 0;

    const getScore = () => score;
    const getName = () => name;
    const getMark = () => mark;
    const winRound = () => {
        score += 1;
    }
    return {
        getName,
        getMark,
        getScore,
        winRound,
    };
}

const displayController = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];

    const render = () => {
        let gameCells = '';
        gameboard.forEach((mark, index) => {
            gameCells += `
                <div class='game_cell' data-index='${index}'>${mark}</div>
            `;
        })
        document.querySelector('.game_field').innerHTML = gameCells;
        const gameSquares = document.querySelectorAll('.game_cell');
        gameSquares.forEach((square) => {
            square.addEventListener('click', gameController.handleClick);
        });
    };

    const update = (currentIndex, mark) => {
        gameboard[currentIndex] = mark;
        render();
        showMessage('');
    };

    const showMessage = (txt) => {
        document.querySelector('#message').textContent = txt;
    };

    const showScoreboard = (playerOneScore, playerOneName, playerTwoScore, playerTwoName) => {
        const scoreboard = document.querySelector('#scoreboard');
        scoreboard.innerHTML = `
            ${playerOneName} ${playerOneScore} : ${playerTwoScore} ${playerTwoName}
        `;
    };

    const showTurn = (mark) => {
        document.querySelector('.turn').textContent = `"${mark}" turn`;
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        showMessage,
        showScoreboard,
        showTurn,
        getGameboard,
    };
})();

const gameController = (() => {
    let players;
    let currentPlayerIndex;
    let gameOver;

    const _checkForWin = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
    };

    const _checkForTie = (board) => {
        return board.every((cell) => cell !== '');
    } 


    const start = () => {
        players = [
            Player(document.querySelector('#player_one').value, 'X'),
            Player(document.querySelector('#player_two').value, 'O')
        ];
        gameOver = false;
        currentPlayerIndex = 0;
        displayController.render();

        const gameSquares = document.querySelectorAll('.game_cell');
        gameSquares.forEach((square) => {
            square.addEventListener('click', handleClick);
        });
        displayController.showScoreboard(
            players[currentPlayerIndex].getScore(), 
            players[currentPlayerIndex].getName(), 
            players[currentPlayerIndex === 0 ? 1 : 0].getScore(), 
            players[currentPlayerIndex === 0 ? 1 : 0].getName()
        );
    };

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            displayController.update(i, '');
        }
        gameOver = false;
        displayController.showMessage('');
    };

    const handleClick = (e) => {
        if (gameOver) {
            return;
        }
        const index = +(e.target.dataset.index);

        if (displayController.getGameboard()[index] !== '') {
            return;
        }
        displayController.update(index, players[currentPlayerIndex].getMark());

        if (_checkForWin(displayController.getGameboard())) {
            gameOver = true;
            players[currentPlayerIndex].winRound()
            displayController.showScoreboard(
                players[currentPlayerIndex].getScore(), 
                players[currentPlayerIndex].getName(), 
                players[currentPlayerIndex === 0 ? 1 : 0].getScore(), 
                players[currentPlayerIndex === 0 ? 1 : 0].getName()
            );
            displayController.showMessage(`${players[currentPlayerIndex].getName()} won!`);
        } else if (_checkForTie(displayController.getGameboard())) {
            gameOver = true;
            displayController.showMessage(`It's a tie!`);
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        displayController.showTurn(players[currentPlayerIndex].getMark());
    };

    return {
        start,
        restart,
        handleClick,
    };
})();

const startGameBtn = document.querySelector('#start_btn');
startGameBtn.addEventListener('click', gameController.start);

const restartGameBtn = document.querySelector('#restart_btn');
restartGameBtn.addEventListener('click', gameController.restart);
