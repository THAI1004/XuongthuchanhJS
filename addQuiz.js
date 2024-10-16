import { addQuiz } from "../services/api.js";
const app = {
    handleAdd: function () {
        const form = document.getElementById("addForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const inputTitle = document.getElementById("title");
            const inputisActive = document.getElementById("isActive");
            const inputTime = document.getElementById("time");
            const inputDescription = document.getElementById("description");
            if (!inputTitle.value.trim()) {
                alert("Cần nhập thông tin Quiz");
                inputTitle.focus();
                return;
            }
            if (!inputTime.value.trim()) {
                alert("Cần nhập thông tin Quiz");
                inputTime.focus();
                return;
            }
            if (!inputDescription.value.trim()) {
                alert("Cần nhập thông tin Quiz");
                inputDescription.focus();
                return;
            }
            const data = {
                title: inputTitle.value,
                isActive: inputisActive.checked,
                time: inputTime.value,
                description: inputDescription.value,
            };
            console.log(data);
            const res = await addQuiz(data);
            window.location = `addQuestion.html?id=${res.id}`;
            alert("Thêm TC");
        });
    },
    start: function () {
        this.handleAdd();
    },
};
app.start();
