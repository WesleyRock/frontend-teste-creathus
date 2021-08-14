import axios from "axios";
const apiClient = {
    async readAlunos() {
        const response = await axios.get("/alunos");
        return response.data;
    },
    async readAluno(alunoId) {
        const response = await axios.get("/alunos/" + alunoId);
        return response.data;
    },
    async createAluno(requestData) {
        const response = await axios.post("/alunos", requestData);
        return response.data;
    },
    async updateAluno(alunoId, requestData) {
        const response = await axios.put("/alunos/" + alunoId, requestData);
        return response.data;
    },

    async deleteAluno(id) {
        await axios.delete(`/alunos/${id}`);
    },

    async readTurmas() {
        const response = await axios.get("/turmas");
        return response.data;
    },
    async createTurma(requestData) {
        const response = await axios.post("/turmas", requestData);
        return response.data;
    },
    async deleteTurma(id) {
        await axios.delete(`/turmas/${id}`);
    },
    async readTurma(turmaId) {
        const response = await axios.get("/turmas/" + turmaId);
        return response.data;
    },
    async updateTurma(turmaId, requestData) {
        const response = await axios.put("/turmas/" + turmaId, requestData);
        return response.data;
    }
};
export default apiClient;
