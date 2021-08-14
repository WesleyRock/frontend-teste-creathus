<template>
  <v-container>
    <h1>Turmas</h1>
    <p></p>
    <v-row>
      <v-col sm="12">
        <v-alert v-if="responseSuccess" dense text type="success">
          Turma salva com sucesso!
        </v-alert>
      </v-col>
      <v-col sm="5">
        <h3>Cadastro de Turma</h3>
        <v-text-field
          :error-messages="erros.nome"
          v-model="turmaRegistration.nome"
          label="Nome da turma"
        ></v-text-field>
        <v-text-field
          v-mask="'##/##/####'"
          :error-messages="erros.data"
          v-model="turmaRegistration.data"
          label="Data Inicial"
        ></v-text-field>
        <v-text-field
          v-mask="'##:##:##'"
          :error-messages="erros.horario"
          v-model="turmaRegistration.horario"
          label="Horário"
        ></v-text-field>
        <v-text-field
          :error-messages="erros.vagas"
          v-model="turmaRegistration.vagas"
          label="Vagas"
        ></v-text-field>
        <v-btn
          class="mt-4"
          v-if="editingId"
          color="primary"
          v-on:click="editTurma"
        >
          Editar
        </v-btn>
        <v-btn class="mt-4" v-else color="primary" v-on:click="createTurma">
          Cadastrar
        </v-btn>
      </v-col>
      <v-col sm="7">
        <h3>Informações</h3>
        <v-simple-table class="elevation-1 mt-10">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">TURMA</th>
                <th class="text-left">DATA INICIAL</th>
                <th class="text-left">HORÁRIO</th>
                <th class="text-left">VAGAS</th>
                <th class="text-left">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="turma in turmas" :key="turma.id">
                <td>{{ turma.nome }}</td>
                <td>{{ turma.data }}</td>
                <td>{{ turma.horario }}</td>
                <td>{{ turma.vagas }}</td>
                <td>
                  <v-btn icon color="pink" v-on:click="deleteTurma(turma.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon color="default" v-on:click="viewTurma(turma.id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon color="blue" v-on:click="initiateEdit(turma.id)">
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
            <v-toolbar color="primary" dark elevation="0">Turma</v-toolbar>
            <v-card-text class="mt-2">
              <strong>Nome: </strong> <span>{{ turmaVisualizar.nome }}</span
              ><br />
              <strong>Data Inicial: </strong
              ><span>{{ turmaVisualizar.data }}</span
              ><br />
              <strong>Horário: </strong
              ><span>{{ turmaVisualizar.horario }}</span
              ><br />
              <strong>Vagas: </strong><span>{{ turmaVisualizar.vagas }}</span
              ><br />
              <strong>Alunos: </strong><br />
              <div v-for="aluno in turmaVisualizar.alunos" :key="aluno.id">
                <span>{{ aluno.nome }}</span
                ><br />
              </div>
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
      dialog: false,
      erros: {
        nome: "",
        data: "",
        horario: "",
        vagas: "",
      },
      turmaRegistration: {
        nome: "",
        data: "",
        horario: "",
        vagas: "",
      },
      turmaVisualizar: {},
      turmas: [],
      editingId: 0,
      responseSuccess: false,
    };
  },
  methods: {
    createTurma: async function () {
      try {
        await api.createTurma(this.turmaRegistration);
        this.turmaRegistration = {
          nome: "",
          data: "",
          horario: "",
          vagas: "",
        };
        this.readTurmas();
        this.responseSuccess = true;
      } catch (error) {
        if (error.response.status == 400) {
          this.erros = error.response.data;
        }
      }
    },
    readTurmas: async function () {
      const data = await api.readTurmas();
      this.turmas = data;
    },
    deleteTurma: async function (turmaid) {
      this.responseSuccess = false;
      await api.deleteTurma(turmaid);
      this.readTurmas();
      this.responseSuccess = true;
    },

    async viewTurma(turmaId) {
      const data = await api.readTurma(turmaId);
      this.turmaVisualizar = data;
      console.log(this.turmaVisualizar);
      this.dialog = true;
    },

    initiateEdit: async function (turmaId) {
      this.editingId = turmaId;
      const data = await api.readTurma(this.editingId);
      this.turmaRegistration = data;
    },
    editTurma: async function () {
      this.responseSuccess = false;
      await api.updateTurma(this.editingId, this.turmaRegistration);
      this.bookRegistration = {};
      this.editingId = 0;
      this.readTurmas();
      this.responseSuccess = true;
      this.turmaRegistration = {};
    },
  },
  mounted() {
    this.readTurmas();
  },
};
</script>