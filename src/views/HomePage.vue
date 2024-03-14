
<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchCity = ref('');
const showMessage = ref('');
const cities = ref([])
const weatherForecast = ref([]);
// const message = ref('');

const logout = () => {
  router.push('/login');
};

onMounted(()=>{
    const getCities = async () =>{
        const showCities = await axios.get(`http://localhost:5000/graphql?query={City{city}}`)
        const showCitiesResponse = showCities.data;
         cities.value = showCitiesResponse.data.City;
        console.log(cities);
    }
    getCities()
})

const fetchWeather = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/graphql?query={weather(city:"${searchCity.value}"){cityName,currentWeather,currentTemperature,upcomingForecast{time, weather, temperature}}}`);
    weatherForecast.value = [response.data.data.weather];
    console.log(weatherForecast.value);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
};

const saveData = async () =>{
 try {
    const weatherToSave =  weatherForecast.value[0];
    const saveResponse = await axios.post('http://localhost:5000/graphql', {
      query: `
        mutation {
          saveWeather(
            city: "${weatherToSave.cityName}",
          ) {
            message
          }
        }
      `,
    })
    const backendResponse = saveResponse.data;
    const message = backendResponse.data.saveWeather.message
    if(message == 'success'){
        showMessage.value = 'City Saved'
    }
 } catch (error) {
    console.log(error)
 }
}

const handleCity = async (city) =>{
    try {
    const response = await axios.get(`http://localhost:5000/graphql?query={weather(city:"${city}"){cityName,currentWeather,currentTemperature,upcomingForecast{time, weather, temperature}}}`);
    weatherForecast.value = [response.data.data.weather];
    console.log(weatherForecast.value);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

</script>

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
      <div class="flex justify-center items-center h-screen bg-gray-100">
        <div class="mt-4">
                <div class="grid grid-cols-3 gap-4">
              <div v-for="(city, index) in cities" :key="index" class="card bg-gray-200 hover:scale-105 transition duration-300">
                <p @click="(e)=>handleCity(city.city)" class="text-sm text-black font-semibold">{{ city.city }}</p>
              </div>
            </div>
          </div>
        <div class="  flex w-1/2 py-8">
          <div >
            <div v-for="(day, index) in weatherForecast" :key="index" class="weather-card">
              <h2 class="text-xl font-bold">{{ day.cityName }}</h2>
              <p class="text-gray-600">{{ day.currentWeather }}</p>
              <p class="text-3xl text-blue-500">{{ day.currentTemperature }}°C</p>
              <h3 class="font-bold">Upcoming Forecast</h3>
              <div class=" mt-4 flex justify-center items-center flex-wrap  ">
                <div  v-for="(forecast, idx) in day.upcomingForecast" :key="idx">
                  <div class="flex gap-3 mr-4 rounded-md" v-if="idx === 0 || forecast.time.split(' ')[0] !== day.upcomingForecast[idx - 1].time.split(' ')[0]">
                    <div class="card w-[150px]  bg-gray-200   hover:scale-105 transition duration-300">
                      <p class="text-sm text-black font-semibold">Date: {{ forecast.time.split(' ')[0] }}</p>
                      <p class="text-sm text-black">Weather: {{ forecast.weather }}</p>
                      <p class="text-sm text-black">Temperature: {{ forecast.temperature }}°C</p>
                    </div>
                  </div>
                </div>
              </div>
              <div><p class="text-black font-extrabold">{{showMessage }}</p></div>
              <div><button @click="saveData" class="bg-blue-400 mt-2 px-6 py-2 rounded-md text-white font-bold">Save</button></div>
            </div>
         
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
.weather-card {
  width: 100%;
  padding: 3rem;
  background-size: cover;
  border-radius: 1rem;
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
