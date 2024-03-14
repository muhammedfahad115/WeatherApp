<script setup>
import { onMounted, ref } from 'vue';
import signupicon from '@/assets/signupicon1.png'
import gmail from '@/assets/gmailicon.png'
import password from '@/assets/password.png'
import user from '@/assets/usericon.png'
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const UserName = ref('');
const Email = ref('');
const Password = ref('');
const ConfirmPassword = ref('');
const error = ref('');
const msg = ref('');

const userNameInput = ref(null);

const focusInput = () =>{
  userNameInput.value.focus();
}

onMounted(()=>{
  focusInput()
})

const confirmCheck = () => {
    if(Password.value)
    return Password.value === ConfirmPassword.value;
}

const regexValidation = () =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexValid = regex.test(Password.value)
    if(!regexValid){
        error.value = 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }else{
        error.value = '';
    }
}


const handleSubmit = async () => {
  if (confirmCheck()) {
    console.log('Form submitted!');
    try {
      const response = await axios.post('http://localhost:5000/graphql', {
        query: `
          mutation {
            signup(username: "${UserName.value}", email: "${Email.value}", password: "${Password.value}") {
                username
                email
                message
             }
          }
        `},
        {
            withCredentials: true
        }
        );
      console.log(response.data);
      const responseData = response.data;
      const {message} = responseData.data.signup
      console.log(message);
      if(message == 'success'){
        router.push('/home')
      }
      msg.value = 'Signup succesfully';
      error.value = '';
    } catch (error) {
      console.log(error);
      error.value = error.error || 'An error occured';
    }
    // console.log(UserName.value, Email.value, Password.value, ConfirmPassword.value);
  } else {
    console.log('password does not match');
    error.value = 'password does not match';
  }
};



</script>

<template>
    <div class="flex  justify-center sm:h-screen items-center">
  <form @submit.prevent="handleSubmit" class=" border-none sm:border-[1px] border-cyan-500 sm:w-[40%] p-8 bg-gray-100   rounded-lg shadow-md">
    <div class="flex justify-center"><img :src='signupicon' class="w-[20%]"></div>
    <br/>
    <label for="userName" class="text-sm font-semibold flex justify-start text-black">UserName:</label>
    <div class="mb-4 bg-white w-full flex px-4 py-2 mt-2  border focus:outline-none focus:border-blue-500 rounded-md">
        <img :src="user" class=" mt-[4px] w-[4%] h-[4%]" >
      <input ref="userNameInput" type="text" v-model="UserName" required class=" w-full outline-none ml-3 placeholder:text-sm placeholder-gray-400" placeholder="Enter your UserName">
    </div>

    <label for="email" class="flex justify-start text-sm font-semibold text-black">Email:</label>
    <div class="mb-4 bg-white w-full flex px-4 py-2 mt-2  border focus:outline-none focus:border-blue-500 rounded-md">
        <img :src="gmail" class=" mt-[4px] w-[4%] h-[4%]">
      <input type="email" v-model="Email" required class=" w-full outline-none ml-3 placeholder:text-sm placeholder-gray-400" placeholder="Enter you E-mail">
    </div>

    <label for="password" class="flex justify-start text-sm font-semibold text-black">Password:</label>
    <div class="mb-4  bg-white w-full flex px-4 py-2 mt-2  border focus:outline-none focus:border-blue-500 rounded-md">
        <img :src="password" class=" mt-[4px] w-[4%] h-[4%]">
      <input @change="regexValidation" type="password" v-model="Password" required class=" w-full outline-none ml-3 placeholder:text-sm placeholder-gray-400" placeholder="Enter your Password">
    </div>

    <div class="mb-4">
      <label for="ConfirmPassword" class="flex justify-start text-sm font-semibold text-black">Confirm Password:</label>
      <input type="password" v-model="ConfirmPassword" required class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400" placeholder="Enter your ConfirmPassword">
    </div>

    <div class=""><p :class="{ 'text-sm text-red-500 font-semibold': error, 'text-sm text-green-500 font-semibold': msg }">{{error || msg}}</p></div>

    <button type="submit" class="bg-blue-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300">SignUp</button>
    <p class="mt-2">Already have a account? <a class="underline" href="/login">Login</a></p> 
  </form>
</div>
</template>
