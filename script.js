const bgMusic = document.getElementById("bg-music");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const hintSound = document.getElementById("hint-sound");

let hintCount = 5;
let currentLevel = 0;

const puzzles = [
    { question: "What has keys but can't open locks?", answer: "piano", location: "Music Hall", clue: "🎹 Plays beautiful sounds", marker: "marker1" },
    { question: "The more you take, the more you leave behind. What is it?", answer: "footsteps", location: "Walking Trail", clue: "🚶 You leave them everywhere", marker: "marker2" },
    { question: "What comes down but never goes up?", answer: "rain", location: "Waterfall", clue: "💧 Falls from the sky", marker: "marker3" }
];

function toggleMusic() {
    let audio = document.getElementById("bg-music");

    if (audio.paused) {
        audio.volume = 0.5;
        audio.play().then(() => {
            document.getElementById("music-toggle").innerText = "🔇 Pause Music";
        }).catch(error => console.log("Autoplay Blocked: ", error));
    } else {
        audio.pause();
        document.getElementById("music-toggle").innerText = "🔊 Play Music";
    }
}

function playMusic() {
    let audio = document.getElementById("bg-music");
    audio.play().catch(error => console.log("Autoplay Blocked: ", error));
}

function showHint() {
    if (hintCount > 0) {
        hintSound.play();
        document.getElementById("clue").textContent = "🔎 Hint: " + puzzles[currentLevel].clue;
        document.getElementById("clue").classList.add("show");

        hintCount--;
        document.getElementById("hint-btn").textContent = '💡 Show Hint (${hintCount} Left)';

        if (hintCount === 0) {
            document.getElementById("hint-btn").disabled = true;
            document.getElementById("hint-btn").textContent = "🚫 No Hints Left";
            document.getElementById("hint-btn").style.background = "gray";
        }
    }
}

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.toLowerCase().trim();
    if (userAnswer === puzzles[currentLevel].answer) {
        correctSound.play();
        document.getElementById("result").textContent = "✅ Correct!";
        document.getElementById("location").textContent = "Next Location: 📍 " + puzzles[currentLevel].location;

        document.getElementById(puzzles[currentLevel].marker).style.display = "block";

        currentLevel++;
        setTimeout(loadPuzzle, 3000);
    } else {
        wrongSound.play();
        document.getElementById("result").textContent = "❌ Wrong! Try again.";
    }
}

function loadPuzzle() {
    document.getElementById("question").textContent = puzzles[currentLevel].question;
}

loadPuzzle();