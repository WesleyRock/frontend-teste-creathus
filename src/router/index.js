import Vue from 'vue'
import VueRouter from 'vue-router'
import Painel from '../views/Painel.vue'
import Aluno from '../views/Aluno.vue'
import Turma from '../views/Turma.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Painel',
    component: Painel
  },
  {
    path: '/alunos',
    name: 'Aluno',
    component: Aluno
  },
  {
    path: '/turmas',
    name: 'Turma',
    component: Turma
  },

]
const router = new VueRouter({
  routes
})
export default router
