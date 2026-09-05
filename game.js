const questions = [
  {
    question: "How long is a U.S. dollar bill?",
    answerInches: 6.14,
    displayAnswer: "6.14 in",
    hint: "Use the bill itself — not a stack of bills."
  },
  {
    question: "How wide is a sheet of U.S. letter paper?",
    answerInches: 8.5,
    displayAnswer: "8.5 in",
    hint: "The shorter side."
  },
  {
    question: "How tall is a regulation basketball hoop?",
    answerInches: 120,
    displayAnswer: "10 ft",
    hint: "Floor to rim."
  },
  {
    question: "How long is an NBA basketball court?",
    answerInches: 1128,
    displayAnswer: "94 ft",
    hint: "Baseline to baseline."
  },
  {
    question: "How tall is a standard bowling pin?",
    answerInches: 15,
    displayAnswer: "15 in",
    hint: "Base to tip."
  },
  {
    question: "How long is a standard credit card?",
    answerInches: 3.3701,
    displayAnswer: "3.370 in",
    hint: "The longer side."
  },
  {
    question: "How wide is a standard credit card?",
    answerInches: 2.125,
    displayAnswer: "2.125 in",
    hint: "The shorter side."
  },
  {
    question: "How tall is an official table-tennis net?",
    answerInches: 6,
    displayAnswer: "6 in",
    hint: "Table surface to top of net."
  },
  {
    question: "How long is an Olympic swimming pool?",
    answerInches: 1968.5039,
    displayAnswer: "50 m",
    hint: "The long-course standard."
  },
  {
    question: "How high is a regulation volleyball net for men's competition?",
    answerInches: 95.6693,
    displayAnswer: "2.43 m",
    hint: "Floor to top of net."
  }
];

const unitToInches = {
  in: 1,
  ft: 12,
  cm: 1 / 2.54,
  m: 100 / 2.54,
  mm: 1 / 25.4
};

let index = 0;
let results = [];

const gameCard = document.getElementById("gameCard");
const summaryCard = document.getElementById("summaryCard");
const progress = document.getElementById("progress");
const questionEl = document.getElementById("question");
const hintEl = document.getElementById("hint");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const unitSelect = document.getElementById("unitSelect");
const validation = document.getElementById("validation");
const resultPanel = document.getElementById("resultPanel");
const actualValue = document.getElementById("actualValue");
const guessValue = document.getElementById("guessValue");
const errorValue = document.getElementById("errorValue");
const scoreValue = document.getElementById("scoreValue");
const verdict = document.getElementById("verdict");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");
const averageError = document.getElementById("averageError");
const totalScore = document.getElementById("totalScore");
const bestGuess = document.getElementById("bestGuess");

function formatNumber(value, maxDigits = 4) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDigits
  });
}

function scoreForError(percentError) {
  return Math.max(0, Math.round(10000 * Math.exp(-percentError / 6)));
}

function verdictForError(error) {
  if (error < 0.1) return "Dead on.";
  if (error < 1) return "Extremely close.";
  if (error < 3) return "Excellent.";
  if (error < 5) return "Very good.";
  if (error < 10) return "Respectable.";
  if (error < 20) return "In the neighborhood.";
  return "Plenty of room to improve.";
}

function showQuestion() {
  const q = questions[index];
  progress.textContent = `${index + 1} / ${questions.length}`;
  questionEl.textContent = q.question;
  hintEl.textContent = q.hint;
  guessInput.value = "";
  validation.textContent = "";
  resultPanel.classList.add("hidden");
  guessForm.classList.remove("hidden");
  guessInput.focus();
}

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rawGuess = Number(guessInput.value);
  const unit = unitSelect.value;

  if (!Number.isFinite(rawGuess) || rawGuess <= 0) {
    validation.textContent = "Enter a number greater than zero.";
    return;
  }

  const q = questions[index];
  const guessInches = rawGuess * unitToInches[unit];
  const percentError =
    Math.abs(guessInches - q.answerInches) / q.answerInches * 100;
  const score = scoreForError(percentError);

  results.push({
    question: q.question,
    percentError,
    score
  });

  actualValue.textContent = q.displayAnswer;
  guessValue.textContent = `${formatNumber(rawGuess)} ${unit}`;
  errorValue.textContent =
    `${formatNumber(percentError, percentError < 1 ? 3 : 2)}%`;
  scoreValue.textContent = `${score.toLocaleString()} pts`;
  verdict.textContent = verdictForError(percentError);

  guessForm.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  nextButton.textContent =
    index === questions.length - 1 ? "See results" : "Next question";
});

nextButton.addEventListener("click", () => {
  index += 1;

  if (index >= questions.length) {
    showSummary();
    return;
  }

  showQuestion();
});

function showSummary() {
  const avg =
    results.reduce((sum, item) => sum + item.percentError, 0) / results.length;
  const total =
    results.reduce((sum, item) => sum + item.score, 0);
  const best =
    results.reduce((a, b) => a.percentError < b.percentError ? a : b);

  gameCard.classList.add("hidden");
  summaryCard.classList.remove("hidden");

  averageError.textContent = `${formatNumber(avg, 2)}%`;
  totalScore.textContent = `${total.toLocaleString()} pts`;
  bestGuess.textContent = `${formatNumber(best.percentError, 3)}% off`;
}

restartButton.addEventListener("click", () => {
  index = 0;
  results = [];
  summaryCard.classList.add("hidden");
  gameCard.classList.remove("hidden");
  showQuestion();
});

showQuestion();
