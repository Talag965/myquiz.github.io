// Initialisera Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://bepljxopenofumegcvrw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcGxqeG9wZW5vZnVtZWdjdnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MTQ0MjksImV4cCI6MjA1MzI5MDQyOX0._NW1FOG_8p8NFF8LT39r6p5TDKGTiZVpW73qnbi1thQ";  
const supabase = createClient(supabaseUrl, supabaseKey);

// Hämta frågor från Supabase
async function fetchQuestions() {
    let { data, error } = await supabase.from('quiz').select('*');
    
    if (error) {
        console.error("Error fetching questions:", error);
        return [];
    }

    return data.map(question => ({
        ...question,
        options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
        correctAnswer: Number(question.correctAnswer)
    }));
}



let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Ladda quizet
async function loadQuiz() {
    questions = await fetchQuestions();
    if (questions.length > 0) {
        console.log("Questions loaded:", questions);
        loadQuestion();
    } else {
        console.log("No questions found.");
    }
}

async function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;

    // Rendera svarsalternativ
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.getElementById('option' + (index + 1));
        if (optionButton) {
            optionButton.textContent = option;
            optionButton.style.display = "inline-block";
            optionButton.onclick = function () {
                checkAnswer(index);
            };
        }
    });

    document.getElementById('restart-btn').style.display = "none";
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1? 'inline-block' : 'none';
}

// Kontrollera svar
window.checkAnswer = function (selectedOptionIndex) {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedOptionIndex === currentQuestion.correctAnswer) {
        score++;
    }

    nextQuestion();
};

window.nextQuestion = function () {
    console.log("Next Question Clicked");
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        console.log("Loading question:", currentQuestionIndex);
        loadQuestion();
    } else {
        endQuiz();
    }
};

window.previousQuestion = function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
};

window.endQuiz = function () {
    document.getElementById('question').textContent = `Bra jobbat! Du fick ${score}/${questions.length}`;

    for (let i = 1; i <= 4; i++) {
        document.getElementById('option' + i).style.display = "none";
    }

    document.getElementById('restart-btn').style.display = "inline-block";
    document.getElementById('prev-btn').style.display = "none";
    document.getElementById('next-btn').style.display = "none";
    document.getElementById('main-menu-btn').style.display = "inline-block";
};

// Starta om quizet
window.restartQuiz = function () {
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
};

// Gå till huvudmenyn
window.goToMainMenu = function () {
    window.location.href = "index.html";
};

window.onload = function () {
    loadQuiz();
    document.getElementById('next-btn').addEventListener("click", nextQuestion);
    document.getElementById('prev-btn').addEventListener("click", previousQuestion);
    document.getElementById('restart-btn').addEventListener("click", restartQuiz);
};
