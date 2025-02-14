import { getQuizById, getQuestionsByIdQuiz } from "../services/api.js";
const listAnswerSubmit = [];
var listQuestion = [];
const btnSubmit = document.getElementById("btn_submit");
var isSubmit = false;
const app = {
    getQuizAndQuestion: async function () {
        const searchParam = new URLSearchParams(window.location.search);
        if (searchParam.has("id")) {
            const id = searchParam.get("id");
            const dataQuiz = await getQuizById(id);
            this.countDown(dataQuiz.time);
            // console.log(dataQuiz);
            this.renderQuiz(dataQuiz);
            listQuestion = await getQuestionsByIdQuiz(id);
            this.renderListQuestion(listQuestion);
        }
    },
    renderQuiz: async function (data) {
        document.getElementById("quiz_heading").innerHTML = data.title;
        document.getElementById("quiz_description").innerHTML = data.description;
    },

    renderListQuestion: function (list) {
        list = this.random(list);
        const data = list
            ?.map((item, index) => {
                const listAs = this.renderAnser(item.answers, item.type, item.id);

                return `                
            <div class="question_item border border-2 rounded p-4 mb-2">
                    <h4 class="question_number">Câu hỏi: ${index + 1}</h4>
                    <h5 class="question_title" id="${item.id}">
                        ${item.questionTiltle};
                    </h5>
                    <div class="answer_items mt-3">
                        ${listAs}
                    </div>
                </div>
`;
            })
            .join("");
        document.getElementById("question_container").innerHTML = data;
    },
    renderAnser: function (answer, type, idQuestion) {
        answer = this.random(answer);
        return answer
            ?.map((as, ind) => {
                return `
                     <div class="form-check fs-5 mb-3">
                            <input 
                            data-idanswer="${as.id}" 
                            data-idquestion="${idQuestion}" 
                            class="form-check-input" 
                            role="button" 
                            type="${type == 1 ? `radio` : `checkbox`}"
                            name="question_${idQuestion}" 
                            id="answer_${idQuestion}_${as.id}" />
                            <label class="form-check-label" role="button" for="answer_${idQuestion}_${as.id}">
                                ${as.answerTitle};
                            </label>
                        </div>
            `;
            })
            .join("");
    },
    random: function (arr) {
        return arr.sort(() => Math.random() - Math.random());
    },

    handleSubmit: function () {
        btnSubmit.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn nộp bài không?")) {
                isSubmit = true;
                this.handleSubmitForm();
                // I. Lấy đáp án mà người lựa chọn
                // 1. lấy tất cả câu trả lời theo từng câu hỏi
            }
        });
    },
    handleSubmitForm: function () {
        const inputAll = document.querySelectorAll("input");
        inputAll.forEach((item) => {
            // hủy hành vi mặc định của sự kiện
            item.addEventListener("click", (e) => {
                e.preventDefault();
            });
        });
        const listAnswersUser = document.querySelectorAll(".answer_items");
        // console.log(listAnswersUser);
        // 2. duyệt qua từng nhóm câu trả lời

        listAnswersUser?.forEach((answers) => {
            // console.log({answers});
            const data = {
                idQuestion: "",
                idAnswers: [],
            };
            const inputs = answers.querySelectorAll("input");

            //3. duyệt mảng các câu trả lời
            inputs?.forEach((ans) => {
                if (ans.checked) {
                    data.idQuestion = ans.dataset.idquestion;
                    data.idAnswers.push(ans.dataset.idanswer);
                }
            });

            if (data.idAnswers && data.idAnswers.length) listAnswerSubmit.push(data);
        });
        console.log(listAnswerSubmit);
        this.checkAnswer(listAnswerSubmit);
    },
    checkAnswer: function (listAnswerSubmit) {
        const checkResult = [];
        // console.log(listAnswerSubmit);
        console.log(listQuestion); // danh sách câu hỏi từ getQuizandQuestion

        // 2. duyệt qua các đáp án mà người dùng lựa chọn
        const listStatus = [];
        let countRight = 0;

        listAnswerSubmit.forEach((ansUser) => {
            // ansUser
            // console.log(ansUser);
            // 2.1 tìm câu hỏi có đáp án trong mảng listQuestion(lấy từ db)
            const findQuestion = listQuestion.find((ques) => {
                return ques.id == ansUser.idQuestion;
            });
            // console.log(findQuestion);
            // 2.2 so sánh giá trị của 2 mảng
            //  ansUser.idAnswers: danh sách đáp của user (mảng)
            // findQuestion.correctAnser: đáp án chính xác lấy từ db (mảng)
            const isCheck = this.checkEqual(ansUser.idAnswers, findQuestion.correctAnser);
            // 2.3 Lưu trữ trạng thái đúng/sai của câu hỏi

            if (isCheck) {
                // nếu đúng tăng count lên 1
                countRight++;
            }
            // lưu trữ trạng thái đúng hoặc sai của câu hỏi đã trả lời
            listStatus.push({
                idQuestion: findQuestion.id,
                status: isCheck,
            });
        });
        // hiên thị trạng thaid đúng hoặc sai của câu hỏi đã trả lời
        this.renderStatus(listStatus);
        // thông báo
        alert(`Ban tra loi dung ${countRight}/${listQuestion.length}`);
        // console.log(listStatus);
    },
    checkEqual: function (arr1, arr2) {
        // kiểm tra xem 2 mảng có bằng nhau hay không
        //1. kiểm tra độ dài của 2 mảng
        if (arr1.length != arr2.length) return false;

        // 2. kiểm tra giá trị
        // arr1 = [1,2,3]
        // arr2 = [1,2,3]
        // 2.1 xắp xếp thứ tự 2 mảng tăng hoặc giảm dần
        arr1 = arr1.sort();
        arr2 = arr2.sort();
        // console.log(arr1);
        // console.log(arr2);
        // 2.2 check đáp án
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        // nêu độ dài bằng nhau và đáp án giống nhau
        return true;
    },
    renderStatus: function (listStatus) {
        listStatus.forEach((item) => {
            const title = document.getElementById(item.idQuestion);
            title.innerHTML = `${title.textContent} ${
                item.status ? `<span class="badge text-bg-success">Đúng</span>` : `<span class="badge text-bg-danger">Sai</span>`
            }`;
        });
    },
    countDown: function (time) {
        time = 5;
        const that = this;
        function handleTime() {
            const minute = Math.floor(time / 60);
            const second = time % 60;
            const timeElement = document.getElementById("timer");
            timeElement.innerHTML = `${minute}:${second}`;
            time--;
            if (isSubmit) {
                clearInterval(timeInterval);
            }
            if (time < 0) {
                that.handleSubmitForm();
                clearInterval(timeInterval);
                timeElement.innerHTML = `Hết thời gian`;
            }
        }
        const timeInterval = setInterval(handleTime, 1000);
    },
    reset: function () {
        const reset = document.getElementById("btn_reset");
        reset.addEventListener("click", () => {
            if (window.confirm("Bạn có chắc chắn  muốn làm lại không?")) {
                window.location.reload();
            }
        });
    },
    start: function () {
        this.handleSubmit();
        this.getQuizAndQuestion();
        this.reset();
    },
};
app.start();
