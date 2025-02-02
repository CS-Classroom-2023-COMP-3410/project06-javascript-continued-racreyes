//Customizable Keyboard Trainer
class KeyboardTrainer {
  constructor() {
    this.difficultySelect = document.getElementById("difficulty");
    this.restartButton = document.getElementById("restart-button");
    this.textContainer = document.getElementById("text-container");
    this.inputField = document.getElementById("input-field");
    this.wpmDisplay = document.getElementById("wpm");
    this.accuracyDisplay = document.getElementById("accuracy");

    // Timer elements
    this.timerDisplay = document.createElement("p");
    this.timerCheckbox = document.createElement("label");
    this.timerCheckbox.innerHTML = `<input type="checkbox" id="enable-timer" class="mr-2"> Enable Timer`;

    this.restartButton.insertAdjacentElement("beforebegin", this.timerDisplay);
    this.restartButton.insertAdjacentElement("beforebegin", this.timerCheckbox);

    this.text = "";
    this.startTime = null;
    this.errors = 0;
    this.totalMistakes = 0;
    this.totalCharsTyped = 0; // Track all characters typed
    this.correctChars = 0;
    this.timeLeft = 25;
    this.timer = null;
    this.timerStarted = false;

    this.wordList = [
      "apple", "banana", "cherry", "dragon", "elephant", "flower", "giraffe", "honey", "island", "jungle",
      "kite", "lemon", "mountain", "notebook", "ocean", "pencil", "quartz", "river", "sunlight", "tulip",
      "umbrella", "violet", "watermelon", "xylophone", "yellow", "zebra"
    ];

    this.init();
  }

  init() {
    this.generateText();
    this.inputField.addEventListener("input", (e) => this.handleInput(e));
    this.restartButton.addEventListener("click", () => this.restart());
    this.difficultySelect.addEventListener("change", () => this.restart());
    this.updateTimerDisplay();
  }

  generateText() {
    const difficulty = this.difficultySelect.value;
    const lengths = { easy: 5, medium: 10, hard: 20 };

    this.text = Array.from({ length: lengths[difficulty] }, () =>
      this.wordList[Math.floor(Math.random() * this.wordList.length)]
    ).join(" ");

    this.textContainer.textContent = this.text;
    this.resetStats();
  }

  resetStats() {
    clearInterval(this.timer);
    this.startTime = null;
    this.errors = 0;
    this.totalMistakes = 0;
    this.totalCharsTyped = 0;
    this.correctChars = 0;
    this.wpmDisplay.textContent = "WPM: 0";
    this.accuracyDisplay.textContent = "Accuracy: 100%";
    this.inputField.value = "";
    this.inputField.disabled = false;
    this.timeLeft = 25;
    this.timerStarted = false;
    this.updateTimerDisplay();
  }

  startTimer() {
    this.timerStarted = true;
    this.startTime = new Date(); // Store exact start time
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) {
        this.endTest();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (document.getElementById("enable-timer").checked) {
      this.timerDisplay.textContent = `Time Left: ${this.timeLeft}s`;
      this.timerDisplay.className = "text-lg font-bold text-yellow-300";
    } else {
      this.timerDisplay.textContent = "Timer: Disabled";
    }
  }

  handleInput(event) {
    const input = event.target.value.trim();

    if (!this.startTime) {
      this.startTime = new Date();
    }

    if (document.getElementById("enable-timer").checked && !this.timerStarted) {
      this.startTimer();
    }

    let correctCount = 0;
    let errorCount = 0;

    input.split("").forEach((char, index) => {
      if (char === this.text[index]) {
        correctCount++;
      } else {
        errorCount++;
        this.totalMistakes++; // Count every mistake, even if corrected
      }
    });

    this.correctChars += correctCount;
    this.errors += errorCount;
    this.totalCharsTyped += input.length; // Track total typed characters

    const elapsedTime = (new Date() - this.startTime) / 1000 / 60; // Time in minutes
    const wordsTyped = this.totalCharsTyped / 5;
    const wpm = elapsedTime > 0.01 ? Math.round(wordsTyped / elapsedTime) : 0; // Ensure time is never too small

    const accuracy = Math.max(0, Math.min(100, ((this.totalCharsTyped - this.totalMistakes) / this.totalCharsTyped) * 100)).toFixed(2);

    this.wpmDisplay.textContent = `WPM: ${wpm}`;
    this.accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    this.highlightErrors(input);

    if (document.getElementById("enable-timer").checked && input === this.text) {
      this.generateNextWords();
    } else if (!document.getElementById("enable-timer").checked && input.length >= this.text.length) {
      this.finish();
    }
  }

  generateNextWords() {
    this.text = Array.from({ length: 5 }, () =>
      this.wordList[Math.floor(Math.random() * this.wordList.length)]
    ).join(" ");

    this.textContainer.textContent = this.text;
    this.inputField.value = "";
  }

  highlightErrors(input) {
    const highlightedText = this.text
      .split("")
      .map((char, index) => {
        if (index < input.length) {
          return char === input[index] ? `<span class='text-green-500'>${char}</span>` : `<span class='text-red-500'>${char}</span>`;
        } else {
          return char;
        }
      })
      .join("");

    this.textContainer.innerHTML = highlightedText;
  }

  endTest() {
    clearInterval(this.timer);
    this.inputField.disabled = true;

    const elapsedTime = (new Date() - this.startTime) / 1000 / 60; // Time in minutes
    const wordsTyped = this.totalCharsTyped / 5;
    const finalWPM = elapsedTime > 0.01 ? Math.round(wordsTyped / elapsedTime) : 0;

    const finalAccuracy = Math.max(0, Math.min(100, ((this.totalCharsTyped - this.totalMistakes) / this.totalCharsTyped) * 100)).toFixed(2);

    this.textContainer.innerHTML = "<span class='text-red-500'>Time's up! Your final results:</span>";
    this.wpmDisplay.textContent = `Final WPM: ${finalWPM}`;
    this.accuracyDisplay.textContent = `Final Accuracy: ${finalAccuracy}%`;
  }

  restart() {
    this.inputField.disabled = false;
    this.generateText();
  }
}

// Initialize the Keyboard Trainer
new KeyboardTrainer();
