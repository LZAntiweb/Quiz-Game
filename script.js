let questions = [];
let currentQuestion = 0;
let score = 0;
let username = "";

const nameContainer = document.getElementById('name-container');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');

const quizScreen = document.getElementById('quiz-screen');
const greeting = document.getElementById('greeting');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const nextBtn = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const progressBar = document.getElementById('progress-bar');

// Enable start button only when input is not empty
usernameInput.addEventListener('input', () => {
  startBtn.disabled = usernameInput.value.trim() === "";
});

// Utility: Shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch questions from JSON
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Failed to load questions');
    questions = await response.json();

    // Shuffle questions
    questions = shuffleArray(questions);

    // Shuffle choices for each question
    questions.forEach(q => {
      const originalChoices = [...q.choices];
      q.choices = shuffleArray(q.choices);
      q.answer = q.choices.findIndex(choice => choice === originalChoices[q.answer]);
    });

    currentQuestion = 0;
    score = 0;
    loadQuestion();
  } catch (error) {
    questionText.textContent = 'Error loading questions!';
    console.error(error);
  }
}

// Load a question
function loadQuestion() {
  choicesContainer.innerHTML = '';
  scoreContainer.innerHTML = '';
  nextBtn.disabled = true;

  const q = questions[currentQuestion];
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = `${username}, ${q.question}`;

  q.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.className = 'choice-btn';
    button.onclick = () => selectAnswer(index);
    choicesContainer.appendChild(button);
  });
}

// Handle answer selection
function selectAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll('.choice-btn');

  buttons.forEach((btn, idx) => {
    if (idx === q.answer) btn.classList.add('correct');
    else if (idx === selectedIndex) btn.classList.add('wrong');
    btn.disabled = true;
  });

  if (selectedIndex === q.answer) score++;
  nextBtn.disabled = false;
}

// Next button click
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    questionNumber.textContent = '';
    questionText.textContent = `Quiz Completed, ${username}!`;
    choicesContainer.innerHTML = '';
    scoreContainer.textContent = `Your score: ${score} / ${questions.length}`;
    nextBtn.style.display = 'none';
    progressBar.style.width = '100%';
  }
});

// Start button click
startBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) {
    // Shake input if empty
    usernameInput.classList.remove('shake');
    void usernameInput.offsetWidth; // trigger reflow
    usernameInput.classList.add('shake');
    return;
  }

  username = name;
  greeting.textContent = `Good luck, ${username}!`;
  nameContainer.style.display = 'none';
  quizScreen.style.display = 'block';
  loadQuestions();
});
