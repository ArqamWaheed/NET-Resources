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

        // Default check "C"
        if (label === 'C') {
            radio.checked = false;
        }

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

const mathsScoreHeader = document.createElement('p');
mathsScoreHeader.id = 'maths-score';
mathsScoreHeader.style.display = 'none';
container.insertBefore(mathsScoreHeader, scoreHeader.nextSibling);

const physicsScoreHeader = document.createElement('p');
physicsScoreHeader.id = 'physics-score';
physicsScoreHeader.style.display = 'none';
container.insertBefore(physicsScoreHeader, mathsScoreHeader.nextSibling);

const equivalentScoreHeader = document.createElement('p');
equivalentScoreHeader.id = 'equivalent-score';
equivalentScoreHeader.style.display = 'none';
container.insertBefore(equivalentScoreHeader, physicsScoreHeader.nextSibling);

const correctAnswersInput = document.createElement('textarea');
correctAnswersInput.id = 'correct-answers';
correctAnswersInput.placeholder = 'Enter correct answers as A, B, C, D,... or as ABCDABCDAABCDDDA';
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

// Warn users about unsaved changes
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your answers will be lost.';
});

// Form submission logic
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let rawAnswers = correctAnswersInput.value.trim();
    rawAnswers = rawAnswers.replace(/[\s,]/g, ''); // Remove spaces, commas

    const correctAnswers = rawAnswers.split('').filter(answer => ['A', 'B', 'C', 'D'].includes(answer));

    if (correctAnswers.length !== 140) {
        alert('Please enter exactly 140 answers in valid format (e.g., ABCDABCDAABCDDDA or A, B, C).');
        return;
    }

    let totalScore = 0;
    let mathsScore = 0;
    let physicsScore = 0;

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
            totalScore++;
            questionDiv.classList.add('correct');
            if (i <= 80) mathsScore++;
            else physicsScore++;
        } else {
            questionDiv.classList.add('incorrect');
            questionDiv.querySelector('.correct-answer').textContent = `Correct answer: ${correctAnswer}`;
        }
    }

    const equivalentScore = (totalScore / 140) * 200;

    scoreHeader.textContent = `Total Score: ${totalScore} out of 140`;
    scoreHeader.style.display = 'block';

    mathsScoreHeader.textContent = `Maths Score: ${mathsScore} out of 80`;
    mathsScoreHeader.style.display = 'block';

    physicsScoreHeader.textContent = `Physics Score: ${physicsScore} out of 60`;
    physicsScoreHeader.style.display = 'block';

    equivalentScoreHeader.textContent = `Equivalent Score: ${equivalentScore.toFixed(2)} out of 200`;
    equivalentScoreHeader.style.display = 'block';

    window.scrollTo(0, 0);

    // Remove unload warning after successful submission
    window.removeEventListener('beforeunload', () => {});
});
