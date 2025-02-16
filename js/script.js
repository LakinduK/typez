const gameArea = document.getElementById("game-area");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score"); // High score display
const highScoreGameOver = document.getElementById("high-score-game-over");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const mainWindow = document.getElementById("main-window");
const gameOverMessage = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from local storage
let gameInterval;
let words = [];
let spawnRate = 1000; // Word spawn frequency
let fallSpeed = 3; // Word falling speed in seconds
startBtn.disabled = false; // Enable start button
// Display high score at the start
highScoreDisplay.textContent = highScore;

// Start Game
startBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  gameArea.innerHTML = "";
  words = [];
  wordInput.value = "";
  wordInput.focus();

  stopGame(); //Stop any running intervals or animations
  startGame();
});

// Restart Game
restartBtn.addEventListener("click", () => {
  gameOverMessage.classList.add("d-none"); // Hide Game Over message
  wordInput.disabled = false; // Re-enable input field
  // mainWindow.hidden = false; // Show main window
  mainWindow.style.display = "block"; // Hide main window
  wordInput.value = ""; // Clear input
  wordInput.focus(); // Focus on input field
  startBtn.disabled = false; // Enable start button
  stopGame(); //Stop any running intervals or animations
  score = 0; // Reset score
  scoreDisplay.textContent = score;

  startGame(); // Restart game logic
});

// Set Difficulty
function setDifficulty() {
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    spawnRate = 1500; // Spawn a word every 1.5 seconds
    fallSpeed = 5; // Words fall in 5 seconds
  } else if (difficulty === "medium") {
    spawnRate = 1000; // Spawn a word every 1 second
    fallSpeed = 3.5; // Words fall in 3.5 seconds
  } else if (difficulty === "hard") {
    spawnRate = 700; // Spawn a word every 0.7 seconds
    fallSpeed = 2.5; // Words fall in 2.5 seconds
  }
}

// Start Game Logic
function startGame() {
  setDifficulty();
  startBtn.disabled = true; // Disable start button while playing

  // Remove any existing listener to avoid duplicate behavior
  wordInput.removeEventListener("input", checkWord);
  wordInput.addEventListener("input", checkWord);

  gameInterval = setInterval(() => {
    spawnWord();
  }, spawnRate);

  wordInput.addEventListener("input", checkWord);
}
// Stop Game
function stopGame() {
  clearInterval(gameInterval); // Stop spawning words
  words.forEach((word) => word.remove()); // Remove all words
  words = []; // Clear word array
}

// Game Over
function gameOver() {
  stopGame(); // Stop spawning and checking words
  highScoreGameOver.textContent = highScore; // Display the high score in game over tab

  // Update high score if current score is higher
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save new high score to local storage
    highScoreDisplay.textContent = highScore; // Update high score display
    highScoreGameOver.textContent = highScore; // Display the high score in game over tab
  }

  finalScore.textContent = score; // Display final score
  gameOverMessage.classList.remove("d-none"); // Show Game Over message
  gameArea.innerHTML = ""; // Clear remaining words
  // mainWindow.hidden = true; // Hide main window
  mainWindow.style.display = "none"; // Hide main window
  wordInput.disabled = true; // Disable input field
  startBtn.disabled = true; // Disable start button

  // Autofocus the Restart Button
  restartBtn.focus();
}

// Spawn a Word
function spawnWord() {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  const wordElement = document.createElement("div");
  wordElement.className = "word";
  wordElement.textContent = word;
  wordElement.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
  wordElement.style.top = `0px`; // Start from top
  wordElement.style.animationDuration = `${fallSpeed}s`;

  gameArea.appendChild(wordElement);
  words.push(wordElement);

  wordElement.addEventListener("animationend", () => {
    // Check if the word is still in the game area, i.e., it hasn't been removed
    if (gameArea.contains(wordElement)) {
      // If word reaches the bottom, game over
      gameArea.removeChild(wordElement);
      words = words.filter((w) => w !== wordElement);
      gameOver();
    }
  });

  // Continuously check if the word has reached the bottom manually (as fall might not trigger animationend)
  const checkPosition = setInterval(() => {
    const wordRect = wordElement.getBoundingClientRect();
    if (
      wordRect.top + wordRect.height >=
      gameArea.getBoundingClientRect().bottom
    ) {
      // Check if wordElement is still in gameArea before attempting to remove
      if (gameArea.contains(wordElement)) {
        gameArea.removeChild(wordElement);
        words = words.filter((w) => w !== wordElement);
        gameOver();
      }
      clearInterval(checkPosition);
    }
  }, 100);
}

// Check User Input
function checkWord() {
  const typedWord = wordInput.value.trim();

  words.forEach((wordElement, index) => {
    const originalWord = wordElement.getAttribute("data-word"); // Retrieve original word
    const wordText = originalWord || wordElement.textContent; // Fallback for first-time setup

    if (wordText.startsWith(typedWord)) {
      // Highlight matching portion in red
      wordElement.innerHTML = `
        <span style="color: red;">${wordText.substring(
          0,
          typedWord.length
        )}</span>${wordText.substring(typedWord.length)}
      `;
      wordElement.setAttribute("data-word", wordText); // Save original word
    } else {
      // Reset the word's color if no match
      wordElement.innerHTML = wordText;
      wordElement.setAttribute("data-word", wordText); // Save original word
    }

    if (typedWord === wordText) {
      // Word fully matched
      score++;
      scoreDisplay.textContent = score;
      gameArea.removeChild(wordElement);
      words.splice(index, 1); // Remove matched word
      wordInput.value = ""; // Clear input
    }
  });
}
