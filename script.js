const startButton = document.getElementById('start-btn');
const userForm = document.getElementById('user-form');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreText = document.getElementById('score-text');
const feedbackText = document.getElementById('feedback-text');
const restartButton = document.getElementById('restart-btn');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let userName = '';
let userId = '';

const questions = [
    {
        question: '¿Cuál es el objetivo principal de la seguridad privada?',
        answers: [
            { text: 'Proteger personas, bienes e infraestructuras minimizando riesgos.', correct: true },
            { text: 'Detener y enjuiciar criminales.', correct: false },
            { text: 'Mantener el orden público en la ciudad.', correct: false }
        ]
    },
    {
        question: 'Según el principio de proporcionalidad, ¿cómo debe actuar un guardia de seguridad ante una amenaza?',
        answers: [
            { text: 'Usando un nivel de fuerza y medios que sea correspondiente a la amenaza.', correct: true },
            { text: 'Utilizando siempre la máxima fuerza para disuadir.', correct: false },
            { text: 'Evitando cualquier tipo de confrontación directa.', correct: false }
        ]
    },
    {
        question: '¿Qué implica la función de "control de accesos"?',
        answers: [
            { text: 'Verificar la identidad y autorización de personas y vehículos que entran o salen.', correct: true },
            { text: 'Realizar rondas de vigilancia perimetral.', correct: false },
            { text: 'Observar el comportamiento de las personas en el interior del recinto.', correct: false }
        ]
    },
    {
        question: 'En caso de detectar un incendio, ¿cuál es una de las primeras y más importantes acciones del personal de seguridad?',
        answers: [
            { text: 'Activar la alarma y seguir el plan de evacuación.', correct: true },
            { text: 'Intentar apagar el fuego sin importar su tamaño.', correct: false },
            { text: 'Buscar al responsable de iniciar el fuego.', correct: false }
        ]
    },
    {
        question: '¿Cuál es la relación que debe existir entre la seguridad privada y las fuerzas de seguridad pública (como la policía)?',
        answers: [
            { text: 'Una relación de colaboración, reportando delitos y cooperando.', correct: true },
            { text: 'La seguridad privada reemplaza a la policía en recintos privados.', correct: false },
            { text: 'No deben tener ningún tipo de contacto o relación.', correct: false }
        ]
    }
];

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBBGH1XWdaNa1Nn_KVr0CrbR3zOFF1eeEhVLaJcZqvCigOUJ3EKQEmZdH7RBmFRVjD/exec';

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    userForm.classList.remove('hide');
    resultContainer.classList.add('hide');
});

function startGame() {
    userName = document.getElementById('nombre').value;
    userId = document.getElementById('identificacion').value;

    if (userName.trim() === '' || userId.trim() === '') {
        alert('Por favor, completa tu nombre y número de identificación.');
        return;
    }

    userForm.classList.add('hide');
    quizContainer.classList.remove('hide');
    score = 0;
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
    });
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            setNextQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function endGame() {
    quizContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    scoreText.innerText = `Tu puntaje es: ${score} de ${questions.length}`;
    
    let feedback = '';
    if (score === questions.length) {
        feedback = '¡Excelente! Eres un experto en seguridad.';
    } else if (score >= 3) {
        feedback = '¡Buen trabajo! Tienes un sólido conocimiento.';
    } else {
        feedback = 'Sigue estudiando, ¡puedes mejorar!';
    }
    feedbackText.innerText = feedback;

    sendDataToSheet();
}

function sendDataToSheet() {
	console.log('Intentando enviar datos a Google Sheets...'); // Añade esta línea
    const data = {
        nombre: userName,
        identificacion: userId,
        puntaje: score
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
