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

        })
    }
    startQuiz()

})