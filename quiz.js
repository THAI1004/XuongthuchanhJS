import { getAllQuiz } from "../services/api.js";
const app = {
    renderListQuiz: async function () {
        const data = await getAllQuiz();
        // console.log(data);
        const listQuiz = data
            ?.map((item, index) => {
                if (item.isActive) {
                    return ` <a href="#" data-id="${item.id}"  class="quiz-items list-group-item list-group-item-action list-group-item-primary">
                    ${item.title} : ${item.description}
                </a>`;
                }
            })
            .join("");
        const listQuizElement = document.getElementById("list_quiz");
        listQuizElement.innerHTML = listQuiz;
        this.handleClickQuiz();
    },
    handleClickQuiz: function () {
        const quizItem = document.querySelectorAll(".quiz-items");
        // console.log(quizItem);
        quizItem.forEach((item) => {
            item.addEventListener(`click`, () => {
                const title = item.textContent;
                if (window.confirm(`Bạn có chắc chắn muốn làm quiz : ${title}`)) {
                    const id = item.getAttribute("data-id");
                    window.location = `question.html?id=${id}`;
                }
            });
        });
    },
    start: function () {
        this.renderListQuiz();
    },
};
app.start();
