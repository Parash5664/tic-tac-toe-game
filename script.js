// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

// DOM elements
const cells = document.querySelectorAll('.cell');
const playerTurnElement = document.getElementById('playerTurn');
const gameStatusElement = document.getElementById('gameStatus');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Initialize the game
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    // Clear all cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning');
    });
    
    // Reset game board styling
    document.querySelector('.game-board').classList.remove('game-over');
    
    // Update UI
    updatePlayerTurn();
    gameStatusElement.textContent = '';
    gameStatusElement.classList.remove('winner', 'draw');
    
    // Add click listeners to cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));
    
    // Check if cell is already filled or game is not active
    if (board[index] !== '' || !gameActive) {
        return;
    }
    
    // Make the move
    makeMove(index, currentPlayer);
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    
    // Update cell display
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    // Add click animation
    cell.style.transform = 'scale(0.9)';
    setTimeout(() => {
        cell.style.transform = 'scale(1)';
    }, 150);
    
    // Check for winner
    const winResult = checkWinner();
    
    if (winResult.winner) {
        endGame(winResult.winner, winResult.combination);
    } else if (board.every(cell => cell !== '')) {
        endGame('draw');
    } else {
        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerTurn();
    }
}

// Check for winner
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combination: combination };
        }
    }
    return { winner: null, combination: null };
}

// End the game
function endGame(result, winningCombination = null) {
    gameActive = false;
    
    if (result === 'draw') {
        gameStatusElement.textContent = "It's a Draw! 🤝";
        gameStatusElement.classList.add('draw');
        scores.draw++;
        updateScoreDisplay();
    } else {
        gameStatusElement.textContent = `Player ${result} Wins! 🎉`;
        gameStatusElement.classList.add('winner');
        scores[result]++;
        updateScoreDisplay();
        
        // Highlight winning combination
        if (winningCombination) {
            winningCombination.forEach(index => {
                cells[index].classList.add('winning');
            });
        }
    }
    
    // Add game over styling to board
    document.querySelector('.game-board').classList.add('game-over');
    
    // Remove click listeners from all cells
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

// Update player turn display
function updatePlayerTurn() {
    playerTurnElement.textContent = currentPlayer;
    playerTurnElement.style.color = currentPlayer === 'X' ? '#e53e3e' : '#3182ce';
}

// Update score display
function updateScoreDisplay() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.draw;
    
    // Add animation to updated score
    const updatedElement = currentPlayer === 'X' ? scoreXElement : 
                          currentPlayer === 'O' ? scoreOElement : scoreDrawElement;
    
    updatedElement.style.transform = 'scale(1.2)';
    updatedElement.style.color = '#48bb78';
    
    setTimeout(() => {
        updatedElement.style.transform = 'scale(1)';
        updatedElement.style.color = '#2d3748';
    }, 300);
}

// Reset scores
function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreDisplay();
    
    // Show confirmation message
    gameStatusElement.textContent = 'Scores Reset! 🔄';
    gameStatusElement.classList.remove('winner', 'draw');
    setTimeout(() => {
        if (gameActive) {
            gameStatusElement.textContent = '';
        }
    }, 2000);
}

// Event listeners
restartBtn.addEventListener('click', () => {
    initGame();
    
    // Show restart message
    gameStatusElement.textContent = 'New Game Started! 🎮';
    gameStatusElement.classList.remove('winner', 'draw');
    setTimeout(() => {
        if (gameActive) {
            gameStatusElement.textContent = '';
        }
    }, 1500);
});

resetScoreBtn.addEventListener('click', resetScores);

// Keyboard support
document.addEventListener('keydown', (event) => {
    // Number keys 1-9 for cell selection
    const key = parseInt(event.key);
    if (key >= 1 && key <= 9) {
        const index = key - 1;
        const cell = cells[index];
        if (board[index] === '' && gameActive) {
            makeMove(index, currentPlayer);
        }
    }
    
    // 'R' key for restart
    if (event.key.toLowerCase() === 'r') {
        initGame();
    }
    
    // 'S' key for reset scores
    if (event.key.toLowerCase() === 's') {
        resetScores();
    }
});

// Add visual feedback for keyboard hints
function showKeyboardHints() {
    cells.forEach((cell, index) => {
        if (board[index] === '') {
            const hint = document.createElement('span');
            hint.textContent = index + 1;
            hint.style.position = 'absolute';
            hint.style.top = '5px';
            hint.style.left = '5px';
            hint.style.fontSize = '0.7rem';
            hint.style.color = '#a0aec0';
            hint.style.fontWeight = 'normal';
            cell.style.position = 'relative';
            cell.appendChild(hint);
        }
    });
}

// Remove keyboard hints
function hideKeyboardHints() {
    cells.forEach(cell => {
        const hint = cell.querySelector('span');
        if (hint) {
            hint.remove();
        }
    });
}

// Show hints on mouse enter game board
document.querySelector('.game-board').addEventListener('mouseenter', showKeyboardHints);
document.querySelector('.game-board').addEventListener('mouseleave', hideKeyboardHints);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    updateScoreDisplay();
    
    // Show welcome message
    gameStatusElement.textContent = 'Welcome! Player X starts first! 🎯';
    setTimeout(() => {
        if (gameActive && gameStatusElement.textContent.includes('Welcome')) {
            gameStatusElement.textContent = '';
        }
    }, 3000);
});

// Prevent context menu on right click for better mobile experience
document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('cell')) {
        e.preventDefault();
    }
});

// Add touch support for mobile devices
let touchStartTime = 0;
cells.forEach(cell => {
    cell.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
    });
    
    cell.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 500) { // Prevent accidental long presses
            e.preventDefault();
            handleCellClick(e);
        }
    });
});