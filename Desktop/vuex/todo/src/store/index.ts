import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
   tasks:[] as Array<{id:number,text:string,completed:boolean}>
  },
  getters: {
    
  },
  mutations: {
    addTask(state,taskText:string){
      state.tasks.push({
        id:Date.now(),
        text:taskText,
        completed:false

      })
    },
    toggleTaskCompletion(state,taskId:number){
      const task=state.tasks.find(t =>t.id===taskId)
      if(task){
        task.completed=!task.completed
      }

    },
    deleteTask(state,taskId:number){
      state.tasks=state.tasks.filter(t=>t.id !==taskId)
    }
    
  },
  actions: {
    addTask({commit},taskText:string){
      commit('addTask',taskText)

    },
    toggleTaskCompletion({commit},taskId:number){
      commit('toggleTaskCompletion',taskId)
    },
    deleteTask({commit},taskId:number){
       commit('deleteTask',taskId)
    }
  },
  modules: {
    
  }
})
