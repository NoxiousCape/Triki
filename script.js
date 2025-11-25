// ===== Game State =====
class TrikiGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameMode = null; // 'pvp' or 'ai'
        this.difficulty = null; // 'easy', 'medium', 'hard'
        this.gameActive = false;
        this.humanPlayer = 'X';
        this.aiPlayer = 'O';

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.selectMode(mode);
            });
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;
                this.selectDifficulty(difficulty);
            });
        });

        // Board cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.handleCellClick(index);
            });
        });

        // Control buttons
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('changeModeBtn').addEventListener('click', () => {
            this.changeMode();
        });
    }

    selectMode(mode) {
        this.gameMode = mode;

        if (mode === 'pvp') {
            this.difficulty = null;
            this.startGame();
        } else if (mode === 'ai') {
            this.showDifficultySelection();
        }
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.startGame();
    }

    showDifficultySelection() {
        document.getElementById('modeSelection').classList.add('hidden');
        document.getElementById('difficultySelection').classList.remove('hidden');
    }

    startGame() {
        this.gameActive = true;
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';

        // Hide selection screens
        document.getElementById('modeSelection').classList.add('hidden');
        document.getElementById('difficultySelection').classList.add('hidden');

        // Show game board
        document.getElementById('gameBoard').classList.remove('hidden');

        // Update UI
        this.updateModeDisplay();
        this.updateCurrentPlayerDisplay();
        this.renderBoard();
        this.clearStatus();
    }

    updateModeDisplay() {
        const modeText = this.gameMode === 'pvp'
            ? 'Dos Jugadores'
            : `Vs Computadora (${this.getDifficultyName()})`;
        document.getElementById('currentMode').textContent = modeText;
    }

    getDifficultyName() {
        const names = {
            'easy': 'Fácil',
            'medium': 'Medio',
            'hard': 'Difícil'
        };
        return names[this.difficulty] || '';
    }

    updateCurrentPlayerDisplay() {
        const playerElement = document.getElementById('currentPlayer');
        playerElement.textContent = this.currentPlayer;
        playerElement.className = `value player-${this.currentPlayer.toLowerCase()}`;
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== null) {
            return;
        }

        // Human player move
        this.makeMove(index, this.currentPlayer);

        // Check for game end
        if (this.checkWinner(this.currentPlayer)) {
            this.endGame('win', this.currentPlayer);
            return;
        }

        if (this.checkDraw()) {
            this.endGame('draw');
            return;
        }

        // Switch player
        this.switchPlayer();

        // AI move if applicable
        if (this.gameMode === 'ai' && this.currentPlayer === this.aiPlayer && this.gameActive) {
            this.showAIThinking();
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.renderBoard();
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
    }

    renderBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const value = this.board[index];
            cell.textContent = value || '';
            cell.className = 'cell';

            if (value) {
                cell.classList.add(value.toLowerCase());
                cell.classList.add('disabled');
            }
        });
    }

    showAIThinking() {
        document.getElementById('gameStatus').textContent = 'La computadora está pensando... 🤔';
    }

    clearStatus() {
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
    }

    // ===== AI Logic =====
    makeAIMove() {
        let move;

        switch (this.difficulty) {
            case 'easy':
                move = this.easyAIMove();
                break;
            case 'medium':
                move = this.mediumAIMove();
                break;
            case 'hard':
                move = this.hardAIMove();
                break;
        }

        if (move !== null && move !== undefined) {
            this.makeMove(move, this.aiPlayer);

            if (this.checkWinner(this.aiPlayer)) {
                this.endGame('win', this.aiPlayer);
                return;
            }

            if (this.checkDraw()) {
                this.endGame('draw');
                return;
            }

            this.switchPlayer();
            this.clearStatus();
        }
    }

    // Easy AI: Random moves
    easyAIMove() {
        const availableMoves = this.getAvailableMoves();
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Medium AI: Block and attack
    mediumAIMove() {
        // Try to win
        const winningMove = this.findWinningMove(this.aiPlayer);
        if (winningMove !== null) return winningMove;

        // Block player
        const blockingMove = this.findWinningMove(this.humanPlayer);
        if (blockingMove !== null) return blockingMove;

        // Take center if available
        if (this.board[4] === null) return 4;

        // Random move
        return this.easyAIMove();
    }

    // Hard AI: Minimax algorithm
    hardAIMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        this.getAvailableMoves().forEach(index => {
            this.board[index] = this.aiPlayer;
            const score = this.minimax(this.board, 0, false);
            this.board[index] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        });

        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        if (this.checkWinner(this.aiPlayer)) {
            return 10 - depth;
        }
        if (this.checkWinner(this.humanPlayer)) {
            return depth - 10;
        }
        if (this.checkDraw()) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            this.getAvailableMoves().forEach(index => {
                this.board[index] = this.aiPlayer;
                const score = this.minimax(this.board, depth + 1, false);
                this.board[index] = null;
                bestScore = Math.max(score, bestScore);
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            this.getAvailableMoves().forEach(index => {
                this.board[index] = this.humanPlayer;
                const score = this.minimax(this.board, depth + 1, true);
                this.board[index] = null;
                bestScore = Math.min(score, bestScore);
            });
            return bestScore;
        }
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = player;
                const isWinning = this.checkWinner(player);
                this.board[i] = null;
                if (isWinning) return i;
            }
        }
        return null;
    }

    getAvailableMoves() {
        return this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
    }

    // ===== Win/Draw Detection =====
    checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        return winPatterns.some(pattern => {
            const isWinner = pattern.every(index => this.board[index] === player);
            if (isWinner) {
                this.highlightWinningCells(pattern);
            }
            return isWinner;
        });
    }

    highlightWinningCells(pattern) {
        const cells = document.querySelectorAll('.cell');
        pattern.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    // ===== Game End =====
    endGame(result, winner = null) {
        this.gameActive = false;
        const statusElement = document.getElementById('gameStatus');

        if (result === 'win') {
            if (this.gameMode === 'ai') {
                if (winner === this.aiPlayer) {
                    statusElement.textContent = '¡La computadora ha ganado! 🤖';
                } else {
                    statusElement.textContent = '¡Felicidades! ¡Has ganado! 🎉';
                }
            } else {
                statusElement.textContent = `¡El jugador ${winner} ha ganado! 🎉`;
            }
            statusElement.className = 'game-status winner';
        } else if (result === 'draw') {
            statusElement.textContent = '¡Es un empate! 🤝';
            statusElement.className = 'game-status draw';
        }

        // Disable all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('disabled');
        });
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;

        // Clear board
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        this.updateCurrentPlayerDisplay();
        this.clearStatus();
    }

    changeMode() {
        this.gameActive = false;
        this.gameMode = null;
        this.difficulty = null;

        // Hide game board
        document.getElementById('gameBoard').classList.add('hidden');

        // Show mode selection
        document.getElementById('modeSelection').classList.remove('hidden');
        document.getElementById('difficultySelection').classList.add('hidden');
    }
}

// ===== Initialize Game =====
const game = new TrikiGame();
