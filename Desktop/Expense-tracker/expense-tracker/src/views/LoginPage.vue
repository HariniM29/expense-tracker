<template>
<div>
    <div>
        <label>Email:</label>
        <input type="email" v-model="email" >
        <label >Password:</label>
        <input type="password" v-model="password">
        
    </div>
    <div>
        <button @click="handleLogin">Login</button>
    </div>
    <div v-if="errorMessage" style="color: red;">
        {{ errorMessage }}
    </div>
</div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
const email=ref('')
const password=ref('')
const errorMessage=ref('')

const router=useRouter();
const handleLogin=async ()=>{
    if(!email.value || !password.value){
        errorMessage.value='Please fill the fields';
        return;
    }
    try{
        const response=await axios.post('http://127.0.0.1:3333/api/login',
            {email:email.value,password:password.value},
            // {withCredentials:true}
            { headers: { 'Content-Type': 'application/json' } }
        );
        if(response.status===200){
            router.push('/register-page');
        }
        console.log(email.value, password.value)

    }
    catch(error:any){
        if(error.response){
            errorMessage.value=error.response.data.message || 'Something went wrong'
        }
    }
}


</script>