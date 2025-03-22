// Audio elements
const bgMusic = document.getElementById("bg-music");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const hintSound = document.getElementById("hint-sound");

// Game variables
let hintCount = 5;
let currentLevel = 0;
let score = 0;
let timeLeft = 60; // seconds per puzzle
let timerInterval;
let currentUser = null;  // store logged in user's name

// Puzzles array – extend this to 130 puzzles as needed.
const puzzles = [
  {
    question: "What has keys but can't open locks?",
    answer: "piano",
    location: "Music Hall",
    clue: "🎹 Plays beautiful sounds",
    marker: "marker1"
  },
  {
    question: "The more you take, the more you leave behind. What is it?",
    answer: "footsteps",
    location: "Walking Trail",
    clue: "🚶 You leave them everywhere",
    marker: "marker2"
  },
  {
    question: "What comes down but never goes up?",
    answer: "rain",
    location: "Waterfall",
    clue: "💧 Falls from the sky",
    marker: "marker3"
  },
  {
    question: "I fly without wings and cry without eyes. What am I?",
    answer: "cloud",
    location: "Sky Park",
    clue: "☁ Floats in the sky",
    marker: "marker4"
  },
  {
    question: "I have a head and a tail but no body. What am I?",
    answer: "coin",
    location: "Treasure Vault",
    clue: "💰 Shiny and round",
    marker: "marker5"
  },
  {
    question: "I am tall when I am young and short when I am old.  What am I?",
    answer: "candle",
    location: "temple",
    clue: "🕯 Lights up the dark",
    marker: "marker6"
  },
  {
    question: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo",
    location: "Treasure Vault",
    clue: "🔊 You hear it when you shout",
    marker: "marker7"
  },
  {
    question: "I have cities but no houses, mountains but no trees, water but no fish. What am I?",
    answer: "map",
    location: "space",
    clue: "🗺 Helps you find your way",
    marker: "marker8"
  },
  {
    question: "What has a neck but no head?",
    answer: "bottle",
    location: "baar",
    clue: "🍾 Holds liquid",
    marker: "marker9"
  },
  {
    question: "I run but never walk. What am I?",
    answer: "river",
    location: "River",
    clue: "🌊 Flows endlessly",
    marker: "marker10"
  },
  {
    question: "I exist when there is light, but direct light kills me. What am I?",
    answer: "shadow",
    location: "streat",
    clue: "🌞 Follows you everywhere",
    marker: "marker11"
  },
  {
    question: "I start with P and end with E, but have thousands of letters. What am I?",
    answer: "post office",
    location: "post office",
    clue: "📮 Where you send letters",
    marker: "marker12"
  },
  {
    question: "I have words but never speak. What am I?",
    answer: "book",
    location: "library",
    clue: "📖 Found in a library",
    marker: "marker13"
  },
  {
    question: "I have a head but no brain. What am I?",
    answer: "nail",
    location: "hardwear shop",
    clue: "🔩🔨 Used in construction"
  },
  {
    question: " I have teeth but don’t bite, and I get sharpened to be used. What am I?",
    answer: "knife",
    location: "kichen",
    clue: "🔪 Used to cut vegitables",
    marker: "marker14"
  },
  {
    question: "I have four fingers and a thumb, but I’m not alive. What am I?",
    answer: "glove",
    location: "workshop",
    clue: "🧤 Keeps your hands warm",
    marker: "marker15"
  },
  {
    question: "I have waves but am not in the sea. What am I?",
    answer: "radio",
    location: "radio station",
    clue: "📻 Plays music",
    marker: "marker16"
  },
  // ... add more puzzles until total levels = 130.
];

const totalLevels = puzzles.length;

// Update static UI elements
function updateUI() {
  document.getElementById("level-indicator").textContent = `Level: ${currentLevel + 1} / ${totalLevels}`;
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
  updateProgressBar();
}

// --- USER LOGIN & PROGRESS FUNCTIONS --- //
function userLogin() {
  // Check if user progress exists in localStorage
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = storedUser;
    // Load saved progress if available
    const savedProgress = JSON.parse(localStorage.getItem(`progress_${currentUser}`));
    if (savedProgress) {
      currentLevel = savedProgress.currentLevel;
      score = savedProgress.score;
      // Optionally load other variables such as hintCount if needed.
    }
  } else {
    // Prompt for username if not logged in
    currentUser = prompt("Enter your username:", "Player");
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    } else {
      currentUser = "Player"; // default fallback
      localStorage.setItem("currentUser", currentUser);
    }
  }
  updateUI();
}

function saveProgress() {
  // Save current game progress in localStorage for the current user
  if (currentUser) {
    const progress = {
      currentLevel: currentLevel,
      score: score
      // You can add more properties here if needed.
    };
    localStorage.setItem(`progress_${currentUser}`, JSON.stringify(progress));
  }
}

function logoutUser() {
  // Clear current user session (keeps progress saved for later use)
  localStorage.removeItem("currentUser");
  currentUser = null;
  location.reload();
}

function switchUser() {
  // Switch user by prompting for new username and saving current progress if needed.
  currentUser = prompt("Enter new username:", "Player");
  if (currentUser) {
    localStorage.setItem("currentUser", currentUser);
    // Reset progress for new user or load existing progress.
    const savedProgress = JSON.parse(localStorage.getItem(`progress_${currentUser}`));
    if (savedProgress) {
      currentLevel = savedProgress.currentLevel;
      score = savedProgress.score;
    } else {
      currentLevel = 0;
      score = 0;
    }
    updateUI();
    loadPuzzle();
  }
}

// --- GAME FUNCTIONS --- //
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    document.getElementById("music-toggle").textContent = "🔇 Stop Music";
  } else {
    bgMusic.pause();
    document.getElementById("music-toggle").textContent = "🔊 Play Music";
  }
}

function showHint() {
  if (hintCount > 0) {
    hintSound.play();
    document.getElementById("clue").textContent = "🔎 Hint: " + puzzles[currentLevel].clue;
    document.getElementById("clue").classList.add("show");

    hintCount--;
    document.getElementById("hint-btn").textContent = `💡 Show Hint (${hintCount} Left)`;

    if (hintCount === 0) {
      document.getElementById("hint-btn").disabled = true;
      document.getElementById("hint-btn").textContent = "🚫 No Hints Left";
      document.getElementById("hint-btn").style.background = "gray";
    }
  }
}

function checkAnswer() {
  clearInterval(timerInterval); // Stop timer on answer submission
  const userAnswer = document.getElementById("answer").value.toLowerCase().trim();
  
  if (userAnswer === puzzles[currentLevel].answer) {
    correctSound.play();
    document.getElementById("result").textContent = "✅ Correct!";
    document.getElementById("location").textContent = "Next Location: 📍 " + puzzles[currentLevel].location;

    // Display marker if exists
    const markerEl = document.getElementById(puzzles[currentLevel].marker);
    if (markerEl) {
      markerEl.style.display = "block";
    }

    // Calculate score: base 10 points + bonus for remaining time
    score += 10 + timeLeft;
    document.getElementById("score").textContent = `Score: ${score}`;
    currentLevel++;
    updateProgressBar();
    saveProgress();  // Save progress after each level

    // Clear answer field for next puzzle
    document.getElementById("answer").value = "";

    if (currentLevel < totalLevels) {
      setTimeout(loadPuzzle, 3000);
    } else {
      setTimeout(endGame, 2000);
    }
  } else {
    wrongSound.play();
    document.getElementById("result").textContent = "❌ Wrong! Try again.";
    // Restart timer if answer is wrong
    startTimer();
  }
}

function loadPuzzle() {
  // Reset hint and timer for new level
  document.getElementById("clue").textContent = "";
  document.getElementById("clue").classList.remove("show");
  hintCount = 5;
  document.getElementById("hint-btn").disabled = false;
  document.getElementById("hint-btn").textContent = `💡 Show Hint (${hintCount} Left)`;
  document.getElementById("hint-btn").style.background = "";

  timeLeft = 60;
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
  startTimer();

  // Update level indicator and question text
  document.getElementById("level-indicator").textContent = `Level: ${currentLevel + 1} / ${totalLevels}`;
  document.getElementById("question").textContent = puzzles[currentLevel].question;
  
  // Clear previous result message
  document.getElementById("result").textContent = "";
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      wrongSound.play();
      document.getElementById("result").textContent = "⏰ Time's up! Try again.";
      // Optionally, let the player try again without penalty or restart timer.
    }
  }, 1000);
}

function updateProgressBar() {
  const progressPercent = ((currentLevel) / totalLevels) * 100;
  document.getElementById("progress-bar").style.width = `${progressPercent}%`;
}

function endGame() {
  document.getElementById("question").textContent = "🎉 Congratulations! You completed the treasure hunt!";
  document.getElementById("answer").style.display = "none";
  document.getElementById("hint-btn").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("location").textContent = "";
  document.getElementById("timer").textContent = "";
  document.getElementById("level-indicator").textContent = "";
  document.getElementById("progress-bar").style.width = "100%";
  
  // Prompt for player name and update leaderboard (currentUser is already set)
  setTimeout(() => {
    const playerName = prompt("Enter your name for the leaderboard:", currentUser);
    if (playerName) {
      updateLeaderboard(playerName, score);
    }
  }, 500);
}

function updateLeaderboard(name, score) {
  // Retrieve leaderboard from localStorage or create a new array
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  // Sort leaderboard by score descending
  leaderboard.sort((a, b) => b.score - a.score);
  // Store updated leaderboard
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
  const listEl = document.getElementById("leaderboard-list");
  listEl.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score}`;
    listEl.appendChild(li);
  });
}

function initLeaderboard() {
  const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  displayLeaderboard(storedLeaderboard);
}

// --- INITIALIZE GAME --- //
function initGame() {
  userLogin();  // Check if user is logged in and load progress
  initLeaderboard();
  loadPuzzle();
}

initGame();