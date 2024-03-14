<script setup>
import {onMounted, ref } from 'vue';
import gmail from '@/assets/gmailicon.png';
import password from '@/assets/password.png';
import loginicon from '@/assets/loginicon.png'
import axios from 'axios';
import router from '@/router';

const Email = ref('');
const Password = ref('');
const error = ref('');
const msg = ref('');
const userNameInput = ref(null);

const focusInput = () =>{
  userNameInput.value.focus();
}

onMounted(()=>{
    focusInput()
})

const handleSubmit = async () => {
  // Your login logic here
  try {
    const response = await axios.post('http://localhost:5000/graphql', {
        query: `
          mutation {
            login(email: "${Email.value}", password: "${Password.value}") {
                message
            }
          }
        `},
        {
            withCredentials: true
        }
        );
        const responseData = response.data;
        const message = responseData.data.login.message;
        if(message == 'success'){
            router.push('/home');
        }
        console.log(message);
  } catch (error) {
    console.log(error)
  }
  console.log('Login form submitted!');
};
</script>

<template>
    <div class="flex  justify-center h-screen items-center">
    <form @submit.prevent="handleSubmit" class="border-none sm:w-[35%]  p-8 bg-gray-100 rounded-lg shadow-md">
        <div class="flex justify-center"><img :src='loginicon' class="w-[20%]"></div>
      <label for="email" class="flex justify-start text-sm font-semibold text-black">Email:</label>
      <div class="mb-4 bg-white w-full flex px-4 py-2 mt-2 border focus:outline-none focus:border-blue-500 rounded-md">
        <img :src="gmail" class=" mt-[4px] w-[4%] h-[4%]">
        <input type="email" ref="userNameInput" v-model="Email" required class="w-full outline-none ml-3 placeholder:text-sm placeholder-gray-400" placeholder="Enter your E-mail">
      </div>
  
      <label for="password" class="flex justify-start text-sm font-semibold text-black">Password:</label>
      <div class="mb-4 bg-white w-full flex px-4 py-2 mt-2 border focus:outline-none focus:border-blue-500 rounded-md">
        <img :src="password" class=" mt-[4px] w-[4%] h-[4%]">
        <input type="password" v-model="Password" required class="w-full outline-none ml-3 placeholder:text-sm placeholder-gray-400" placeholder="Enter your Password">
      </div>
  
      <div class=""><p :class="{ 'text-sm text-red-500 font-semibold': error, 'text-sm text-green-500 font-semibold': msg }">{{error || msg}}</p></div>
  
      <button type="submit" class="bg-blue-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300">Login</button>
      
      <p class="mt-2">Don't have an account? <a class="underline" href="/">Signup</a></p>
    </form>
</div>
  </template>