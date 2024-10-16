export const getAllQuiz = async () => {
    try {
        const res = await fetch("http://localhost:3000/quizs");
        const data = await res.json();
        return data;
    } catch (err) {
        alert("Lỗi");
    }
};
export const getQuestionsByIdQuiz = async (idQuiz) => {
    try {
        const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`);
        const data = await res.json();
        return data;
    } catch (er) {
        alert("Lỗi");
    }
};
export const getQuizById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/quizs/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        alert(error);
    }
};
export const addQuiz = async (data) => {
    try {
        const res = await fetch(`http://localhost:3000/quizs`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const dataRes = await res.json();
        return dataRes;
    } catch (error) {
        alert("Lỗi");
    }
};
export const addQuestions = async (datas) => {
    try {
        datas.forEach(async (item) => {
            await fetch("http://localhost:3000/questions", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
        });
    } catch (error) {}
};
