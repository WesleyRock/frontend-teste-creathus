<template>
  <v-container>
    <h1>Turmas</h1>
    <p></p>
    <v-row>
      <v-col sm="12">
        <v-alert v-if="responseSuccess" dense text type="success">
          Aluno salvo com sucesso!
        </v-alert>
        <v-alert v-if="responseError" dense text type="error">
          {{ msgError }}
        </v-alert>
      </v-col>
      <v-col sm="5">
        <h3>Cadastro de Aluno</h3>
        <v-text-field
          :error-messages="erros.nome"
          v-model="alunoRegistration.nome"
          label="Nome"
        ></v-text-field>
        <v-text-field
          v-mask="'##/##/####'"
          :error-messages="erros.nascimento"
          v-model="alunoRegistration.nascimento"
          label="Data de Nasc."
        ></v-text-field>
        <v-text-field
          :error-messages="erros.idade"
          v-model="alunoRegistration.idade"
          label="Idade"
        ></v-text-field>
        <v-select
          :error-messages="erros.sexo"
          v-model="alunoRegistration.sexo"
          :items="selectSexo"
          item-text="label"
          item-value="value"
          label="Sexo"
        ></v-select>
        <v-text-field
          v-mask="'(##) #####-####'"
          :error-messages="erros.telefone"
          v-model="alunoRegistration.telefone"
          label="Telefone"
        ></v-text-field>
        <v-text-field
          :error-messages="erros.email"
          v-model="alunoRegistration.email"
          label="Email"
        ></v-text-field>
        <v-select
          :error-messages="erros.turmaId"
          v-model="alunoRegistration.turmaId"
          :items="turmas"
          item-text="nome"
          item-value="id"
          label="Turma"
        ></v-select>
        <v-btn
          class="mt-4"
          v-if="editingId"
          color="primary"
          v-on:click="editAluno"
        >
          Editar
        </v-btn>
        <v-btn class="mt-4" v-else color="primary" v-on:click="createAluno">
          Cadastrar
        </v-btn>
      </v-col>
      <v-col sm="7">
        <h3>Informações</h3>
        <v-simple-table class="elevation-1 mt-10">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">NOME</th>
                <th class="text-left">DATA DE NASC.</th>
                <th class="text-left">IDADE</th>
                <th class="text-left">SEXO</th>
                <th class="text-left">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunos" :key="aluno.id">
                <td>{{ aluno.nome }}</td>
                <td>{{ aluno.nascimento }}</td>
                <td>{{ aluno.idade }}</td>
                <td>{{ aluno.sexo }}</td>
                <td>
                  <v-btn icon color="pink" v-on:click="deleteAluno(aluno.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon color="default" v-on:click="viewAluno(aluno.id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon color="blue" v-on:click="initiateEdit(aluno.id)">
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        max-width="600"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark elevation="0">Aluno</v-toolbar>
            <v-card-text class="mt-2">
              <strong>Nome: </strong> <span>{{ alunoVisualizar.nome }}</span
              ><br />
              <strong>Data de Nascimento: </strong
              ><span>{{ alunoVisualizar.nascimento }}</span
              ><br />
              <strong>Idade: </strong><span>{{ alunoVisualizar.idade }}</span
              ><br />
              <strong>Email: </strong><span>{{ alunoVisualizar.email }}</span
              ><br />
              <strong>Sexo: </strong
              ><span>{{
                alunoVisualizar.sexo === "M" ? "Masculino" : "Feminino"
              }}</span
              ><br />
              <strong>Telefone: </strong
              ><span>{{ alunoVisualizar.telefone }}</span
              ><br />
              <strong>Turma: </strong
              ><span>{{ alunoVisualizar.nomeTurma }}</span
              ><br />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-container>
</template>
<script>
import api from "@/service/apiService";
export default {
  name: "Turma",
  data() {
    return {
      selectSexo: [
        {
          label: "Feminino",
          value: "F",
        },
        {
          label: "Masculino",
          value: "M",
        },
      ],
      dialog: false,
      erros: {
        nome: "",
        nascimento: "",
        idade: "",
        telefone: "",
        sexo: "",
        email: "",
        turmaId: "",
      },
      alunoRegistration: {
        nome: "",
        nascimento: "",
        idade: "",
        telefone: "",
        sexo: "",
        email: "",
        turmaId: "",
      },
      alunoVisualizar: {},
      alunos: [],
      turmas: [],
      editingId: 0,
      msgError: "",
      responseError: false,
      responseSuccess: false,
    };
  },
  methods: {
    createAluno: async function () {
      try {
        await api.createAluno(this.alunoRegistration);
        this.alunoRegistration = {};
        this.readAlunos();
        this.responseSuccess = true;
        this.responseError = false;
      } catch (error) {
        if (error.response.status == 400) {
          this.erros = error.response.data;
        } else if (error.response.status == 500) {
          this.msgError = error.response.data.message;
          this.responseError = true;
        }
      }
    },
    readAlunos: async function () {
      const data = await api.readAlunos();
      this.alunos = data;
    },
    deleteAluno: async function (turmaid) {
      this.responseSuccess = false;
      await api.deleteAluno(turmaid);
      this.readAlunos();
      this.responseSuccess = true;
      this.responseError = false;
    },

    async viewAluno(alunoId) {
      const data = await api.readAluno(alunoId);
      this.alunoVisualizar = data;
      console.log(this.alunoVisualizar);
      this.dialog = true;
    },

    initiateEdit: async function (alunoId) {
      this.editingId = alunoId;
      const data = await api.readAluno(this.editingId);
      this.alunoRegistration = data;
    },
    editAluno: async function () {
      this.responseSuccess = false;
      await api.updateAluno(this.editingId, this.alunoRegistration);
      this.alunoRegistration = {};
      this.editingId = 0;
      this.readAlunos();
      this.responseSuccess = true;
      this.responseError = false;
      this.alunoRegistration = {};
    },
    readTurmas: async function () {
      const data = await api.readTurmas();
      this.turmas = data;
    },
  },
  mounted() {
    this.readAlunos();
    this.readTurmas();
  },
};
</script>