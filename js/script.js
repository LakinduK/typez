// Game Variables
const wordList = [
  "apple",
  "banana",
  "cherry",
  "date",
  "grape",
  "lemon",
  "mango",
  "orange",
  "peach",
  "pear",
];
const gameArea = document.getElementById("game-area");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const mainWindow = document.getElementById("main-window");
const gameOverMessage = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let gameInterval;
let words = [];
let spawnRate = 1000; // Word spawn frequency
let fallSpeed = 3; // Word falling speed in seconds

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
  mainWindow.hidden = false; // Show main window
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
  finalScore.textContent = score; // Display final score
  gameOverMessage.classList.remove("d-none"); // Show Game Over message
  gameArea.innerHTML = ""; // Clear remaining words
  mainWindow.hidden = true; // Hide main window
  wordInput.disabled = true; // Disable input field
  startBtn.disabled = true; // Disable start button
}

// Spawn a Word
function spawnWord() {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  const wordElement = document.createElement("div");
  wordElement.className = "word";
  wordElement.textContent = word;
  wordElement.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
  wordElement.style.animationDuration = `${fallSpeed}s`;

  gameArea.appendChild(wordElement);
  words.push(wordElement);

  wordElement.addEventListener("animationend", () => {
    if (gameArea.contains(wordElement)) {
      gameArea.removeChild(wordElement);
      words = words.filter((w) => w !== wordElement);
      gameOver(); // End the game if a word reaches the bottom
    }
  });
}

// Check User Input
function checkWord() {
  const typedWord = wordInput.value.trim();
  for (let i = 0; i < words.length; i++) {
    if (words[i].textContent === typedWord) {
      // Correct Word Typed
      score++;
      scoreDisplay.textContent = score;
      gameArea.removeChild(words[i]);
      words.splice(i, 1);
      wordInput.value = "";
      break;
    }
  }
}

// Stop Game
function stopGame() {
  clearInterval(gameInterval);
  words.forEach((word) => word.remove());
  words = [];
}

