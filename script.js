// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerCountdown;
let score = 0;
let timeLeft = 30;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Run a 30-second countdown and stop the game at 0
  timerCountdown = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Add 1 point when a drop is clicked, then remove it from the game
  drop.addEventListener(
    "click",
    () => {
      score += 1;
      scoreDisplay.textContent = score;
      drop.remove();
    },
    { once: true }
  );

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerCountdown);
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());
  
  // Display end-game message based on score
  const endMessageElement = document.getElementById("end-message");
  const winningMessages = [
    "Woo! You are on fire",
    "Too good! keep going",
    "This is too easy for you"
  ];
  
  if (score >= 20) {
    // Show a random winning message
    const randomMessage = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    endMessageElement.textContent = randomMessage;
    endMessageElement.classList.add("winning");
  } else {
    // Show try again message
    endMessageElement.textContent = "Try again!";
    endMessageElement.classList.remove("winning");
  }
  
  endMessageElement.classList.remove("hidden");
}
