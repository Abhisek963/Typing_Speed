const textEl = document.getElementById("text-to-type");
const inputEl = document.getElementById("user-input");
const startBtn = document.getElementById("start-button");
const scoreEl = document.getElementById("score");

let startTime = null;

// Local fallback sentences (used if API fails)
const fallbackSentences = [
  "Practice makes progress so keep typing with patience and focus to improve your speed and accuracy.",
  "Building small projects is the fastest way to learn and to showcase your skills in a simple portfolio.",
  "Clean code is easy to read and easy to change which saves time for everyone who works on it later.",
  "Typing the same sentence again and again helps your fingers learn the pattern and build muscle memory.",
  "Front end development mixes logic and design so it is both analytical and creative at the same time.",
  "Consistent effort each day beats random bursts of work because habits compound your results quickly.",
  "Measure words per minute and accuracy together to get a fair picture of your true typing performance.",
  "Short breaks reduce fatigue and help you maintain steady focus during longer typing practice sessions.",
  "Keyboard posture and relaxed shoulders matter more than you think for speed comfort and long term health.",
  "Reading more improves vocabulary and rhythm which indirectly boosts your natural typing fluency."
];

// Get a sentence: try API first, fall back locally if needed
async function getSentence() {
  textEl.textContent = "Loading sentence...";
  try {
    // Simpler endpoint: returns a single object
    const res = await fetch("https://api.quotable.io/random");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return data.content;
  } catch (err) {
    // Fallback so the app always works
    const s = fallbackSentences[Math.floor(Math.random() * fallbackSentences.length)];
    return s;
  }
}

async function startTest() {
  inputEl.value = "";
  inputEl.disabled = true;
  scoreEl.textContent = "";
  startTime = null;

  const sentence = await getSentence();
  textEl.textContent = sentence;
  inputEl.disabled = false;
  inputEl.focus();
}

startBtn.addEventListener("click", startTest);

inputEl.addEventListener("input", () => {
  const entered = inputEl.value;
  const target = textEl.textContent;

  if (!startTime && entered.length > 0) {
    startTime = new Date();
  }

  if (entered === target) {
    const endTime = new Date();
    const seconds = (endTime - startTime) / 1000;
    const words = target.trim().split(/\s+/).length;
    const wpm = (words / seconds) * 60;

    // Accuracy: correct chars / total chars
    let correct = 0;
    for (let i = 0; i < entered.length; i++) {
      if (entered[i] === target[i]) correct++;
    }
    const accuracy = (correct / target.length) * 100;

    scoreEl.textContent =
      `Speed: ${wpm.toFixed(2)} WPM | Accuracy: ${accuracy.toFixed(2)}% | Time: ${seconds.toFixed(2)}s | Words: ${words}`;

    inputEl.disabled = true;
  }
});
