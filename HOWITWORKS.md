# How it works... 🤔💭

This is a detailed beginner guide for new developers to learn how this game is made.


## Code Explanation

This project is a simple typing game where words fall from the top of the screen, and the user has to type them before they reach the bottom. Below is a detailed explanation of how the code works.

---

## Main Components of the Code

### 1. **HTML Structure**
The HTML file defines the following key elements:
- A `div` for the game area where words will fall.
- Input fields for typing words.
- Displays for current score and high score.
- Buttons for starting, restarting, and selecting difficulty levels.
- Game-over UI elements to show the final score and high score.

---

### 2. **Game Initialization**
```javascript
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from local storage
let gameInterval;
let words = [];
let spawnRate = 1000; // Word spawn frequency
let fallSpeed = 3; // Word falling speed in seconds
```
- score: Tracks the player's current score.
- highScore: Loads the high score from local storage.
- gameInterval: Manages the interval for spawning new words.
- words: Stores the active falling words.
- spawnRate and fallSpeed: Control the difficulty by setting how fast words spawn and fall.

### 3. **Game Start Logic**
```javascript
startBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  gameArea.innerHTML = "";
  words = [];
  wordInput.value = "";
  wordInput.focus();

  stopGame(); // Stop any running intervals or animations
  startGame(); // Start the game
});
```
Start Button: Resets the game state and initializes the game logic by clearing old words, resetting scores, and focusing on the input box.

### 4. **Difficulty Selection**
```javascript
function setDifficulty() {
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    spawnRate = 1500; // Word spawn frequency
    fallSpeed = 5;    // Word falling speed
  } else if (difficulty === "medium") {
    spawnRate = 1000;
    fallSpeed = 3.5;
  } else if (difficulty === "hard") {
    spawnRate = 700;
    fallSpeed = 2.5;
  }
}
```
Adjusts the spawnRate and fallSpeed based on the selected difficulty.

### 5. **Word Spawning**
```javascript
function spawnWord() {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  const wordElement = document.createElement("div");
  wordElement.className = "word";
  wordElement.textContent = word;
  wordElement.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
  wordElement.style.top = `0px`;
  wordElement.style.animationDuration = `${fallSpeed}s`;

  gameArea.appendChild(wordElement);
  words.push(wordElement);

  wordElement.addEventListener("animationend", () => {
    if (gameArea.contains(wordElement)) {
      gameArea.removeChild(wordElement);
      words = words.filter((w) => w !== wordElement);
      gameOver(); // Trigger game over if the word reaches the bottom
    }
  });
}
```
- Words are selected randomly from a predefined word list.
- Words are styled and appended to the game area.
- If a word reaches the bottom of the game area without being typed, the game ends.

### 6. **User Input Handling**
```javascript
function checkWord() {
  const typedWord = wordInput.value.trim();

  words.forEach((wordElement, index) => {
    const wordText = wordElement.textContent;

    if (wordText.startsWith(typedWord)) {
      wordElement.innerHTML = `
        <span style="color: red;">${wordText.substring(
          0,
          typedWord.length
        )}</span>${wordText.substring(typedWord.length)}
      `;
    } else {
      wordElement.innerHTML = wordText;
    }

    if (typedWord === wordText) {
      score++;
      scoreDisplay.textContent = score;
      gameArea.removeChild(wordElement);
      words.splice(index, 1);
      wordInput.value = "";
    }
  });
}
```
- The function checks the user's input against active words.
- Matches are highlighted in red.
- If a word is fully typed, it is removed, and the score is updated.

### 7. **Game Over Logic**
```javascript
function gameOver() {
  stopGame();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save high score to local storage
  }
  highScoreDisplay.textContent = highScore; // Update high score display
  gameOverMessage.classList.remove("d-none"); // Show game-over message
  wordInput.disabled = true; // Disable input field
}
```
- Stops the game by clearing all intervals and removing words.
- Updates and saves the high score if applicable.
- Displays the game-over screen.

### 8. **Restart Functionality**
```javascript
restartBtn.addEventListener("click", () => {
  gameOverMessage.classList.add("d-none");
  wordInput.disabled = false;
  mainWindow.style.display = "block";
  wordInput.focus();
  stopGame();
  score = 0;
  scoreDisplay.textContent = score;
  startGame();
});
```
- Resets the game state and restarts the game logic.
- Ensures that focus is set back to the input field for immediate typing.

### 9. **Local Storage for High Score**
```javascript
let highScore = localStorage.getItem("highScore") || 0;

if (score > highScore) {
  highScore = score;
  localStorage.setItem("highScore", highScore);
}
```
- Saves and retrieves the high score from the browser's localStorage.
- Ensures that the user's high score persists across sessions.

### 10. **Responsive UI**
- The UI dynamically adjusts to user interactions (e.g., hiding/showing game-over screen, updating scores, etc.).
- Ensures user input is focused after restart for a seamless experience.

### How It All Comes Together

1. The user clicks the "Start" button, initializing the game.
2. Words start falling at a rate and speed determined by the selected difficulty.
3. The user types words to score points and prevent them from reaching the bottom.
4. If a word reaches the bottom, the game ends, and the high score is updated.
5. The user can restart the game to try again.

This code combines DOM manipulation, event handling, animations, and local storage to create an interactive and engaging game experience.