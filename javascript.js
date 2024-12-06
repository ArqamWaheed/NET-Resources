const container = document.querySelector(".container");

// Create fieldsets for sections
const mathsFieldset = document.createElement('fieldset');
const mathsLegend = document.createElement('legend');
mathsLegend.textContent = 'Maths';
mathsFieldset.appendChild(mathsLegend);

const physicsFieldset = document.createElement('fieldset');
const physicsLegend = document.createElement('legend');
physicsLegend.textContent = 'Physics';
physicsFieldset.appendChild(physicsLegend);

const englishFieldset = document.createElement('fieldset');
const englishLegend = document.createElement('legend');
englishLegend.textContent = 'English';
englishFieldset.appendChild(englishLegend);

// Function to create questions dynamically
const createQuestions = (start, end, fieldset, sectionStart) => {
    for (let i = start; i <= end; i++) {
        const div = document.createElement('div');
        div.classList.add('radio-container');

        const questionNumber = i - sectionStart + 1;

        const questionHeading = document.createElement('h4');
        questionHeading.textContent = `Question ${questionNumber}`;
        div.appendChild(questionHeading);

        ['A', 'B', 'C', 'D', 'E'].forEach((label) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `radio-${i}-${label}`;
            radio.name = `question-${i}`;
            radio.value = label;
            radio.required = true;

            const radioLabel = document.createElement('label');
            radioLabel.htmlFor = radio.id;
            radioLabel.textContent = label;

            div.appendChild(radio);
            div.appendChild(radioLabel);
        });

        const correctAnswerDiv = document.createElement('div');
        correctAnswerDiv.classList.add('correct-answer');
        div.appendChild(correctAnswerDiv);

        fieldset.appendChild(div);
    }
};

// Create sections
createQuestions(1, 80, mathsFieldset, 1);
createQuestions(81, 140, physicsFieldset, 81);
createQuestions(141, 160, englishFieldset, 141);

container.appendChild(mathsFieldset);
container.appendChild(physicsFieldset);
container.appendChild(englishFieldset);

// Add form elements
const scoreHeader = document.createElement('h2');
scoreHeader.id = 'score-header';
scoreHeader.style.display = 'none';
container.insertBefore(scoreHeader, container.firstChild);

const scoreOutOf200Header = document.createElement('p');
scoreOutOf200Header.id = 'score-out-of-200';
scoreOutOf200Header.style.display = 'none';
container.insertBefore(scoreOutOf200Header, scoreHeader.nextSibling);

const mathsScoreDisplay = document.createElement('p');
mathsScoreDisplay.id = 'maths-score';
mathsScoreDisplay.style.display = 'none';
container.insertBefore(mathsScoreDisplay, scoreOutOf200Header.nextSibling);

const physicsScoreDisplay = document.createElement('p');
physicsScoreDisplay.id = 'physics-score';
physicsScoreDisplay.style.display = 'none';
container.insertBefore(physicsScoreDisplay, mathsScoreDisplay.nextSibling);

const englishScoreDisplay = document.createElement('p');
englishScoreDisplay.id = 'english-score';
englishScoreDisplay.style.display = 'none';
container.insertBefore(englishScoreDisplay, physicsScoreDisplay.nextSibling);

const correctAnswersInput = document.createElement('textarea');
correctAnswersInput.id = 'correct-answers';
correctAnswersInput.placeholder = 'Enter correct answers for 160 questions, separated by commas or directly (e.g., ABCDA...)';
correctAnswersInput.style.width = '100%';
correctAnswersInput.style.marginBottom = '20px';
correctAnswersInput.style.padding = '10px';
correctAnswersInput.style.fontSize = '1rem';

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Submit';
submitButton.style.marginTop = '20px';
submitButton.style.padding = '10px 20px';
submitButton.style.fontSize = '1rem';
submitButton.style.cursor = 'pointer';

const form = document.createElement('form');
form.id = 'quiz-form';
form.appendChild(correctAnswersInput);
form.appendChild(mathsFieldset);
form.appendChild(physicsFieldset);
form.appendChild(englishFieldset);
form.appendChild(submitButton);

container.appendChild(form);

let formModified = false;
form.addEventListener('input', () => {
    formModified = true;
});

window.addEventListener('beforeunload', (e) => {
    if (formModified) {
        e.preventDefault();
        e.returnValue = '';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    formModified = false;

    const rawAnswers = correctAnswersInput.value;

    // Parse input to handle both comma-separated and direct formats
    const correctAnswers = rawAnswers
        .replace(/[^ABCDE]/g, '')
        .split('')
        .map(answer => answer.trim().toUpperCase())
        .filter(answer => ['A', 'B', 'C', 'D', 'E'].includes(answer));

    if (correctAnswers.length !== 160) {
        alert('Please enter exactly 160 answers in the correct format.');
        return;
    }

    let score = 0;
    let mathsScore = 0;
    let physicsScore = 0;
    let englishScore = 0;

    for (let i = 1; i <= 160; i++) {
        const selectedRadio = document.querySelector(`input[name="question-${i}"]:checked`);
        if (!selectedRadio) {
            alert(`Please answer Question ${i}`);
            return;
        }

        const userAnswer = selectedRadio.value;
        const correctAnswer = correctAnswers[i - 1];

        const questionDiv = document.querySelector(`#radio-${i}-${userAnswer}`).closest('.radio-container');

        if (userAnswer === correctAnswer) {
            score++;
            questionDiv.classList.add('correct');
            if (i <= 80) mathsScore++;
            else if (i <= 140) physicsScore++;
            else englishScore++;
        } else {
            questionDiv.classList.add('incorrect');
            questionDiv.querySelector('.correct-answer').textContent = `Correct answer: ${correctAnswer}`;
        }
    }

    // Display scores
    scoreHeader.textContent = `Your Total Score: ${score} out of 160`;
    scoreHeader.style.display = 'block';

    const scoreOutOf200 = (score / 160) * 200;
    scoreOutOf200Header.textContent = `Equivalent Score: ${scoreOutOf200.toFixed(2)} out of 200`;
    scoreOutOf200Header.style.display = 'block';

    mathsScoreDisplay.textContent = `Maths Score: ${mathsScore} out of 80`;
    mathsScoreDisplay.style.display = 'block';

    physicsScoreDisplay.textContent = `Physics Score: ${physicsScore} out of 60`;
    physicsScoreDisplay.style.display = 'block';

    englishScoreDisplay.textContent = `English Score: ${englishScore} out of 20`;
    englishScoreDisplay.style.display = 'block';

    window.scrollTo(0, 0);
});
