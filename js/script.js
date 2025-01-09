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

let score = 0;
let gameInterval;
let words = [];

// Start Game
startBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  gameArea.innerHTML = "";
  words = [];
  wordInput.value = "";
  wordInput.focus();

  startGame();
});

// Start Game Logic
function startGame() {
  gameInterval = setInterval(() => {
    spawnWord();
  }, 1000);

  wordInput.addEventListener("input", checkWord);
}

// Spawn a Word
function spawnWord() {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  const wordElement = document.createElement("div");
  wordElement.className = "word";
  wordElement.textContent = word;
  wordElement.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
  wordElement.style.animationDuration = `${Math.random() * 3 + 2}s`; // Random falling speed

  gameArea.appendChild(wordElement);
  words.push(wordElement);

  wordElement.addEventListener("animationend", () => {
    // Remove word if it reaches the bottom
    gameArea.removeChild(wordElement);
    words = words.filter((w) => w !== wordElement);
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
