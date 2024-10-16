import { addQuestions } from "../services/api.js";
const app = {
    renderQuestion: function () {
        const currentQuestion = document.querySelectorAll(".question_item")?.length + 1 || 1;
        const listQuestion = document.getElementById("listQuestion");
        const divElement = document.createElement("div");
        divElement.classList = `question_item border border-2 rounded p-4 mb-2`;
        divElement.innerHTML = `
            <h4 class="question_number">Câu hỏi: ${currentQuestion}</h4>
                    <div class="mb-3">
                        <label for="question_${currentQuestion}" class="form-label">Nội dung câu hỏi</label>
                        <textarea class="form-control" id="question${currentQuestion}"></textarea>
                    </div>
                    <div class="answer_items mt-3">
                        <div class="form-check fs-5 mb-3">
                            <input
                                class="form-check-input border border-2 border-primary"
                                role="button"
                                type="radio"
                                name="question_${currentQuestion}"
                                id="check_${currentQuestion}_1"
                            />
                            <div class="mb-3">
                                <input type="text" class="form-control" id="answer_${currentQuestion}_1" placeholder="Nhập nội dung đáp án 1" />
                            </div>
                        </div>

                        <div class="form-check fs-5 mb-3">
                            <input
                                class="form-check-input border border-2 border-primary"
                                role="button"
                                type="radio"
                                name="question_${currentQuestion}"
                                id="check_${currentQuestion}_2"
                            />
                            <div class="mb-3">
                                <input type="text" class="form-control" id="answer_${currentQuestion}_2" placeholder="Nhập nội dung đáp án 2" />
                            </div>
                        </div>

                        <div class="form-check fs-5 mb-3">
                            <input
                                class="form-check-input border border-2 border-primary"
                                role="button"
                                type="radio"
                                name="question_${currentQuestion}"
                                id="check_${currentQuestion}_3"
                            />
                            <div class="mb-3">
                                <input type="text" class="form-control" id="answer_${currentQuestion}_3" placeholder="Nhập nội dung đáp án 3" />
                            </div>
                        </div>

                        <div class="form-check fs-5 mb-3">
                            <input
                                class="form-check-input border border-2 border-primary"
                                role="button"
                                type="radio"
                                name="question_${currentQuestion}"
                                id="check_${currentQuestion}_4"
                            />
                            <div class="mb-3">
                                <input type="text" class="form-control" id="answer_${currentQuestion}_4" placeholder="Nhập nội dung đáp án 4" />
                            </div>
                        </div>
        `;
        listQuestion.appendChild(divElement);
        document.getElementById(`question${currentQuestion}`)?.focus();
        document.getElementById(`question${currentQuestion}`).scrollIntoView({ behavior: "smooth" });
    },
    handleAdd: function () {
        document.getElementById("btnAdd").addEventListener("click", () => {
            this.renderQuestion();
        });
    },
    handleSubmit: function () {
        document.getElementById("btnSubmit").addEventListener("click", async () => {
            const listData = document.querySelectorAll(".question_item");
            const searchParam = new URLSearchParams(window.location.search);
            let idQuiz;
            if (searchParam.has("id")) {
                idQuiz = searchParam.get("id");
            }
            console.log(listData);
            const data = [];
            for (var i = 0; i < listData.length; i++) {
                const questionContent = document.getElementById(`question${i + 1}`);
                const checks = listData[i].querySelectorAll("input[type=radio]");
                console.log(checks);
                const answerList = listData[i].querySelectorAll("input[type=text]");
                console.log(answerList);

                const isCheck = this.validate(questionContent, checks, answerList);
                if (!isCheck) {
                    break;
                }
                const item = {
                    questionTiltle: questionContent.value,
                    answers: [],
                    quizId: idQuiz,
                    Type: 1,
                    correctAnser: [],
                };
                answerList.forEach((ans, index) => {
                    item.answers.push({
                        id: (index + 1).toString(),
                        answerTitle: ans.value,
                    });
                });
                checks.forEach((check, index) => {
                    if (check.checked) {
                        item.correctAnser.push((index + 1).toString());
                    }
                });
                data.push(item);
            }
            console.log(data);
            if (data.length == listData.length) {
                await addQuestions(data);
                window.location = "listQuiz.html";
                alert("Thêm thành công");
            }
        });
    },
    validate: function (questionContent, checks, answerList) {
        if (!questionContent.value.trim()) {
            alert("Cần nhập đủ nội dung câu hỏi");
            questionContent.focus();
            return false;
        }
        var ischeckRadio = false;
        for (var i = 0; i < checks.length; i++) {
            if (checks[i].checked) {
                ischeckRadio = true;
                break;
            }
        }
        if (!ischeckRadio) {
            alert("cần lựa chọn đáp án đúng");
            checks[0].focus();
            return false;
        }
        var isCheckAnswer = true;
        for (var i = 0; i < answerList.length; i++) {
            if (!answerList[i].value.trim()) {
                alert("Cần nhập nội dung đáp án");
                isCheckAnswer = false;
                answerList[i].focus();
                break;
            }
        }
        if (!isCheckAnswer) {
            return false;
        }
        return true;
    },
    start: function () {
        this.renderQuestion();
        this.handleAdd();
        this.handleSubmit();
    },
};
app.start();
