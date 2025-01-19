<template>
    <div>
        <label>New Task</label>
    <input type="text"  v-model="newTaskText">
    <button @click="handleAddTask">Add Task</button>
    <ul>
        <li v-for="task in tasks" :key="task.id">
            <input type="checkbox" :checked="task.completed" @change="handleToggleTaskCompletion(task.id)">
            <span :class="{ completed: task.completed }">{{ task.text }}</span>
            <button @click="handleDeleteTask(task.id)" >Delete</button>
        </li>
    </ul>
    </div>

</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
    
    data(){
        return{
            newTaskText:'',
            
        }
    },
    computed:{
        ...mapState(['tasks'])
    },
    methods:{
        ...mapMutations(['addTask','deleteTask','toggleTaskCompletion']),
        handleAddTask(){
            if(this.newTaskText.trim()){
                this.addTask(this.newTaskText);
                this.newTaskText=''
            }

        },
        handleToggleTaskCompletion(taskId){
            this.toggleTaskCompletion(taskId)
        },
        handleDeleteTask(taskId){
            this.deleteTask(taskId)
        }
    }
}
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}

button {
  margin-left: 10px;
}

input[type="checkbox"] {
  margin-right: 10px;
}
</style>
