const container = document.querySelector(".container");

const mathsFieldset = document.createElement('fieldset');
const mathsLegend = document.createElement('legend');
mathsLegend.textContent = 'Maths';
mathsFieldset.appendChild(mathsLegend);

const physicsFieldset = document.createElement('fieldset');
const physicsLegend = document.createElement('legend');
physicsLegend.textContent = 'Physics';
physicsFieldset.appendChild(physicsLegend);

for (let i = 1; i <= 140; i++) {
    const div = document.createElement('div');
    div.classList.add('radio-container');

    const isMaths = i <= 80;
    const questionNumber = isMaths ? i : i - 80;

    const questionHeading = document.createElement('h4');
    questionHeading.textContent = `Question ${questionNumber}`;
    div.appendChild(questionHeading);

    ['A', 'B', 'C', 'D'].forEach((label) => {
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

    if (isMaths) {
        mathsFieldset.appendChild(div);
    } else {
        physicsFieldset.appendChild(div);
    }
}

container.appendChild(mathsFieldset);
container.appendChild(physicsFieldset);

const scoreHeader = document.createElement('h2');
scoreHeader.id = 'score-header';
scoreHeader.style.display = 'none';
container.insertBefore(scoreHeader, container.firstChild);

const scoreOutOf200Header = document.createElement('p');
scoreOutOf200Header.id = 'score-out-of-200';
scoreOutOf200Header.style.display = 'none';
container.insertBefore(scoreOutOf200Header, scoreHeader.nextSibling);

const correctAnswersInput = document.createElement('textarea');
correctAnswersInput.id = 'correct-answers';
correctAnswersInput.placeholder = 'Enter correct answers in order, separated by commas (e.g., A, B, C, D, ...)';
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
form.appendChild(submitButton);

container.appendChild(form);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawAnswers = correctAnswersInput.value;
    const correctAnswers = rawAnswers
        .split(',')
        .map(answer => answer.trim().toUpperCase())
        .filter(answer => ['A', 'B', 'C', 'D'].includes(answer));

    if (correctAnswers.length !== 140) {
        alert('Please enter exactly 140 answers, separated by commas.');
        return;
    }

    let score = 0;
    for (let i = 1; i <= 140; i++) {
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
        } else {
            questionDiv.classList.add('incorrect');
            questionDiv.querySelector('.correct-answer').textContent = `Correct answer: ${correctAnswer}`;
        }
    }

    scoreHeader.textContent = `Your Score: ${score} out of 140`;
    scoreHeader.style.display = 'block';

    const scoreOutOf200 = (score / 140) * 200;
    scoreOutOf200Header.textContent = `Your Score: ${scoreOutOf200.toFixed(2)} out of 200`;
    scoreOutOf200Header.style.display = 'block';

    window.scrollTo(0, 0);
});