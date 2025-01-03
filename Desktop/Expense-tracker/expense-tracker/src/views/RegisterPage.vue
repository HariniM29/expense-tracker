<template>
  <div>
    <div>
        <label>Email</label>
        <input v-model="email" type="email">
        <label>Password</label>
        <input v-model="password" type="password">
        <label>Re-enter password</label>
        <input v-model="confirm_password" type="password">

    </div>
    <div>
        <button @click="handleRegister">Register</button>
    </div>
    <div v-if="errorMessage" style="color: red;">
        {{ errorMessage }}

    </div>
    <div v-if="successMessage" style="color: green;">
      {{ successMessage }}
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const confirm_password = ref('');
const errorMessage=ref('')
const successMessage = ref('');
const router=useRouter()
const handleRegister=async ()=>{
    if(!email.value || !password.value){
        errorMessage.value="pls fill all the fields"
    }
    if(password.value !== confirm_password.value){
        errorMessage.value="Password does not match"
    }

    try{
        const response=await axios.post('http://127.0.0.1:3333/api/register',
            {email:email.value,password:password.value},
            { headers: { 'Content-Type': 'application/json' } }
        )
        if(response.status===201){
            successMessage.value="Registration succesfull"
            errorMessage.value=''
            setTimeout(()=>{
                router.push('/login-page')
            },1000)

        }
    }
    catch(error:any){
        if(error.response){
            errorMessage.value=error.response.data.message;
            successMessage.value='';
        }
    }
}


</script>