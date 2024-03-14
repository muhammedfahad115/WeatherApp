<template>
    <div class="flex flex-col h-screen">
      <!-- Header section -->
      <div class="bg-gray-800 text-white py-4">
        <div class="container mx-auto sm:flex justify-between items-center px-6">
          <h1 class="text-2xl font-bold">WEATHER APP</h1>
          <div class="flex">
            <input v-model="searchCity" @keydown.enter="fetchWeather" class="bg-gray-200 rounded-xl text-green-800 h-10 px-4 outline-none" type="text" placeholder="Search Cities">
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md ml-4">Logout</button>
          </div>
        </div>
      </div>
      
      <!-- Main content -->
      <div class="flex-1 bg-gray-100">
        <div class="container flex justify-center items-center py-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div v-for="(day, index) in weatherForecast" :key="index" class="weather-card  hover:scale-105 transition duration-300">
              <h2 class="text-xl font-bold">{{ day.cityName }}</h2>
              <p class="text-gray-600">{{ day.currentWeather }}</p>
              <p class="text-3xl text-blue-500">{{ day.currentTemperature }}°C</p>
              <div class="temperature mt-4">
                <h3 class="font-bold">Upcoming Forecast</h3>
                <div v-for="(forecast, idx) in day.upcomingForecast" :key="idx">
                  <div v-if="idx === 0 || forecast.time.split(' ')[0] !== day.upcomingForecast[idx - 1].time.split(' ')[0]">
                    <div class="card bg-gray-200 p-4">
                      <p class="text-sm text-gray-600 font-semibold">Date: {{ forecast.time.split(' ')[0] }}</p>
                      <p class="text-sm text-gray-600">Weather: {{ forecast.weather }}</p>
                      <p class="text-sm text-gray-600">Temperature: {{ forecast.temperature }}°C</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchCity = ref('');
const weatherForecast = ref([]);

const logout = () => {
  router.push('/login');
};

const fetchWeather = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/graphql?query={weather(city:"${searchCity.value}"){cityName,currentWeather,currentTemperature,upcomingForecast{time, weather, temperature}}}`);
    weatherForecast.value = [response.data.data.weather];
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
};
</script>

<style scoped>
.weather-card {
  width: 100%;
  padding: 3rem;
  background-size: cover;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.weather-card h2 {
  margin-top: 0;
}

.temperature {
  font-size: 1.2em;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
