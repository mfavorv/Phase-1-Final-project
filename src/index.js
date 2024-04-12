document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("result");
    const questionsContainer = document.getElementById("quiz-container");
    const startQuizButton = document.getElementById("begin");

// GET CATEGORIES FROM API
    const fetchCategories = () => {
        const categoryDropdown = document.getElementById("category");
        fetch("https://opentdb.com/api_category.php")
            .then(response => response.json())
            .then(data => {
                data.trivia_categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categoryDropdown.appendChild(option);
                });
            })
            .catch(error => console.error("Error fetching categories:", error));
    };

    // FUNCTION TO START QUIZ
    const startQuiz = () => {
        const category = document.getElementById("category").value;
        const difficulty = document.getElementById("difficulty").value;
        const amount = document.getElementById("number").value || 10;
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
              
                questionsContainer.innerHTML = "";
                const correctAnswers = [];

                data.results.forEach((question, index) => {
                    const questionElement = document.createElement("div");
                    questionElement.classList.add("question");

                    const paragraph = document.createElement("p");
                    paragraph.innerHTML = `${index + 1}. ${question.question}`;
                    questionElement.appendChild(paragraph);

                    const answers = [...question.incorrect_answers, question.correct_answer];
                    answers.forEach(answer => {
                        const multipleChoices = document.createElement("div");
                        multipleChoices.classList.add("answer-options");

                        const radioInput = document.createElement("input");
                        radioInput.type = "radio";
                        radioInput.name = `answer_${index}`;
                        radioInput.value = answer;
                        multipleChoices.appendChild(radioInput);

                        const answerText = document.createElement("label");
                        answerText.innerHTML = answer;
                        multipleChoices.appendChild(answerText);

                        questionElement.appendChild(multipleChoices);

                        if (answer === question.correct_answer) {
                            correctAnswers.push(answer);
                        }
                    });

                    questionsContainer.appendChild(questionElement);
                });

 // SUBMIT BUTTON
                const submitButton = document.createElement("button");
                submitButton.id = "submit";
                submitButton.textContent = "Submit";
                submitButton.addEventListener("click", () => {
                    let score = 0;
                    const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
                    radioButtons.forEach((radioButton, index) => {
                        if (radioButton.value === correctAnswers[index]) {
                            score++;
                        }
                    });
                    resultContainer.textContent = `You got ${score} out of ${amount} questions correct.`;
                    submitButton.disabled = true;
                    retryButton.disabled = false;
                    submitButton.remove();
                });
                questionsContainer.appendChild(submitButton);

//RETRY BUTTON
                const retryButton = document.createElement("button");
                retryButton.id = "retry";
                retryButton.textContent = "Retake Quiz";
               
                retryButton.addEventListener("click", () => {
                resultContainer.textContent = "";
                startQuiz();
                retryButton.disabled = true;
                retryButton.remove();
                submitButton.disabled = true;
                submitButton.remove();
            });
                questionsContainer.appendChild(retryButton);
            })
            .catch(error => console.error("Error fetching questions:", error));
    };

// START QUIZ BUTTON
    startQuizButton.addEventListener("click", (event) => {
        event.preventDefault();
        startQuiz();
    });

   
    fetchCategories();
});
