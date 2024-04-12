document.addEventListener("DOMContentLoaded", () => {
    let results = 0;
    let questions; 

 //GETTING THE CATEGORIES FROM THE API
    const categoriesUrl = "https://opentdb.com/api_category.php";
    const fetchCategories = () => {
        fetch(categoriesUrl)
            .then(response => response.json())
            .then(data => {
                const categoryDropdown = document.getElementById("category");
                data.trivia_categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categoryDropdown.appendChild(option);
                });
            })
            .catch(error => console.error("Error:", error));
    };
    fetchCategories();

 //START QUIZ FUNCTION
     function startQuiz() {
        const startQuizButton = document.getElementById("begin");
        startQuizButton.addEventListener("click", (event) => {
            event.preventDefault();
            
            results = 0;
            const category = document.getElementById("category").value;
            const difficulty = document.getElementById("difficulty").value;
            const amount = document.getElementById("number").value || 10;
            questions = document.getElementById("quiz-container");
            questions.innerHTML = ""; 

            const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
            fetch(apiUrl)
                .then(res => res.json())
                .then(data => {
                    data.results.forEach((question, index) => {
                        const questionElement = document.createElement("div");
                        questionElement.classList.add("question");

                        const paragraph = document.createElement("p");
                        paragraph.textContent = `${index + 1}. ${question.question}`;
                        questionElement.appendChild(paragraph);

                        const answers = [...question.incorrect_answers, question.correct_answer];
                        answers.forEach(answer => {
                        const multipleChoices = document.createElement("div");
                        multipleChoices.classList.add("answer-option");

                        const radioInput = document.createElement("input");
                            radioInput.type = "radio";
                            radioInput.name = `answer_${index}`;
                            radioInput.value = answer;
                            multipleChoices.appendChild(radioInput);

                            const answerText = document.createElement("label");
                            answerText.textContent = answer;
                            multipleChoices.appendChild(answerText);

                            questionElement.appendChild(multipleChoices);
                });
                questions.appendChild(questionElement);
        })
    })
        .catch(error => console.error("Error in fetching questions:", error));
            
//RETRY BUTTON
            const retryButton = document.createElement("button");
            retryButton.textContent = "Retake Quiz"; 
            retryButton.addEventListener("click", () => {
                questions.innerHTML = ""; 
                results = 0;
                retryButton.disabled = true;
                retryButton.remove();
               
                submitButton.disabled = true;
                submitButton.remove();
               
                startQuiz();
                
                
            });
            document.body.appendChild(retryButton);

//SUBMIT BUTTON
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit"; 
    submitButton.addEventListener("click", () => {
        results = 0;
        const radioButtons = document.querySelectorAll('input[type="radio"]:checked');

        radioButtons.forEach(radioButton => {
            const selectedAnswer = radioButton.value;
         
            if (selectedAnswer === data.correct_answer) {
                results++;
            }
        });
        const resultContainer = document.getElementById("result");
        resultContainer.textContent = `You got ${results} out of ${amount} questions correct.`;
        submitButton.disabled = true;
        submitButton.remove();
        startQuiz();
    })
    
    document.body.appendChild(submitButton);   

     })
    }
    startQuiz()

})