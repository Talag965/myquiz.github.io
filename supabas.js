 // Initialisera Supabase
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 const supabaseUrl = "https://bepljxopenofumegcvrw.supabase.co";
 const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcGxqeG9wZW5vZnVtZWdjdnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MTQ0MjksImV4cCI6MjA1MzI5MDQyOX0._NW1FOG_8p8NFF8LT39r6p5TDKGTiZVpW73qnbi1thQ";  // Byt ut med din Supabase API-nyckel
 const supabase = createClient(supabaseUrl, supabaseKey);

 // Frågor från Supabase
 async function fetchQuestions() {
     let { data, error } = await supabase
         .from('quiz') // Namnet på din tabell i Supabase
         .select('*'); // Hämtar alla fält

     if (error) {
         console.error("Error fetching questions:", error);
         return [];
     }
     return data;
 }

 // Hämta public URL för bilder från Supabase Storage
 async function getImageUrl(imagePath) {
     const { data, error } = await supabase
         .storage
         .from('images') // Namnet på din "images" bucket
         .getPublicUrl(imagePath); // Filvägen till bilden

     if (error) {
         console.error("Error fetching image:", error);
         return null;
     }
     return data.publicUrl;
 }

 // Frågor och andra inställningar
 let questions = [];
 let currentQuestionIndex = 0;
 let score = 0;

 // Ladda quiz och hantera frågorna
 async function loadQuiz() {
     questions = await fetchQuestions();  // Hämta frågorna från Supabase
     if (questions.length > 0) {
         console.log("Questions loaded:", questions);
         loadQuestion();
     } else {
         console.log("No questions found.");
     }
 }

 // Ladda en specifik fråga och visa dess innehåll
 async function loadQuestion() {
     const currentQuestion = questions[currentQuestionIndex];
     document.getElementById('question').textContent = currentQuestion.question;

     // Hämta bild-URL om den finns
     const imageUrl = await getImageUrl(currentQuestion.image);
     if (imageUrl) {
         document.getElementById('question-image').src = imageUrl; // Sätt src till den hämtade URL:en
         document.getElementById('question-image').style.display = 'block'; // Visa bilden
     }

     currentQuestion.options.forEach((option, index) => {
         const optionButton = document.getElementById('option' + (index + 1));
         optionButton.textContent = option;
         optionButton.style.display = "inline-block";
         optionButton.onclick = function() {
             checkAnswer(index);
         };
     });

     document.getElementById('restart-btn').style.display = "none";
     document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
     document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
 }

 // Checka svaret och gå till nästa fråga
 function checkAnswer(selectedOptionIndex) {
     const currentQuestion = questions[currentQuestionIndex];

     if (selectedOptionIndex === currentQuestion.correctAnswer) {
         score++;
     }

     nextQuestion();
 }

 // Gå till nästa fråga
 function nextQuestion() {
     if (currentQuestionIndex < questions.length - 1) {
         currentQuestionIndex++;
         loadQuestion();
     } else {
         endQuiz();
     }
 }

 // Gå till föregående fråga
 function previousQuestion() {
     if (currentQuestionIndex > 0) {
         currentQuestionIndex--;
         loadQuestion();
     }
 }

 // Slutför quiz och visa resultat
 function endQuiz() {
     document.getElementById('question').textContent =
         "Bra jobbat! Du fick " + score + "/" + questions.length;

     for (let i = 1; i <= 4; i++) {
         document.getElementById('option' + i).style.display = "none";
     }

     document.getElementById('restart-btn').style.display = "inline-block";
     document.getElementById('prev-btn').style.display = "none";
     document.getElementById('next-btn').style.display = "none";
     document.getElementById('main-menu-btn').style.display = "inline-block";
 }

 // Starta om quiz
 function restartQuiz() {
     currentQuestionIndex = 0;
     score = 0;
     loadQuestion();
 }

 // Gå till huvudmenyn
 function goToMainMenu() {
     window.location.href = "index.html"; 
 }

 // Ladda quiz när sidan laddas
 window.onload = loadQuiz;

