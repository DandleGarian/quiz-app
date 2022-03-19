const API = `https://opentdb.com/api.php?amount=50&category=11&type=multiple`;

const quiz = document.getElementById(`quiz`);
const questionEl = document.getElementById(`question`);
const answerChoices = document.querySelectorAll(`.answer-choice`);
const answersText = document.querySelectorAll(`.answer-text`);
const scoreCard = document.querySelector(`#score`);
const progress = document.querySelector(`#progress`);
const progressBar = document.querySelector(`.progress-bar-filler`);

let currentQuestion = 0;
let score = 0;

getQuizData();

async function getQuizData() {
    const res = await fetch(API);
    const data = await res.json();
    // console.log(data.results);
    let currentQuizData = data.results[currentQuestion];
    
    function loadQuiz() {
        currentQuizData = data.results[currentQuestion];
        // console.log(currentQuizData)

        questionEl.innerHTML = currentQuizData.question;
        
        let choices = [];
        
        const incorrectAnswers = currentQuizData.incorrect_answers;

        incorrectAnswers.forEach(incorrectAnswer => {
            const answerObj = {
                answer: incorrectAnswer,
                correct: false
            }
            choices.push(answerObj);
        });

        const correctAnswer = {
            answer: currentQuizData.correct_answer,
            correct: true
        };

        choices.splice(Math.floor(Math.random() * (choices.length + 1)), 0, correctAnswer);

        answersText.forEach((answerText, idx) => {
            answerText.innerText = ``
            answerText.innerHTML = choices[idx].answer
            answerText.classList.remove(`correct`, `incorrect`)
            if(choices[idx].correct === true) {
                answerText.classList.add(`correct`);
            } else {
                answerText.classList.add(`incorrect`);
            }
        });
    }

    function selectAnswer() {
        answersText.forEach(answerText => {
            answerText.addEventListener(`click`, (e) => {
                let selectedEl = e.target;
                if(selectedEl) {

                    if(selectedEl.classList.contains(`correct`)) {
                        score++;
                        currentQuestion++;
                        updateProgress();
                    } else {
                        currentQuestion++;
                        updateProgress();
                    }
                    loadQuiz();

                    if(currentQuestion > 19) {
                    quiz.innerHTML = `
                        <h2>You answered ${score}/20 questions correctly.</h2>
                        
                        <button onclick="location.reload()">reload quiz</button>
                        `
                    }
                }
            });
        });
    }
    loadQuiz();
    selectAnswer();
}

function updateProgress() {
    scoreCard.innerHTML = `${score}`;
    progress.innerHTML =`${currentQuestion}/20`;
    progressBar.style.width = `${currentQuestion * 5}%`;
}
