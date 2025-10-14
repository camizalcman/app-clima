<script setup>
import { ref } from "vue";
import Vestimenta from './components/Vestimenta.vue'

const clima = ref(null);
const errorMsg = ref("");

const myAPIKey = "8ba418c512314911b0a200932251210";

//Función para obtener clima
function obtenerClima(lat = null, lon = null){

  //armo la URL
  const climaURL = new URL("https://api.weatherapi.com/v1/current.json");
  
  //parámetros
  climaURL.searchParams.append("key", myAPIKey);    
  climaURL.searchParams.append("lang", "es");

  //Si están las coordenadas coordenadas, uso lat y lon, sino uso la ciudad por defecto
  if (lat !== null && lon !== null) {
    climaURL.searchParams.append("q", `${lat},${lon}`);
  } else {
    climaURL.searchParams.append("q", "Buenos Aires");
  }

  //Configuracion de la request
  const myHeaders = {
      "Authorization": myAPIKey, //envio la clave de autorización
      "Content-Type": "application/json", //declaro el tipo de contenido
      "Accept": "application/json" //declaro el tipo de contenido que acepto en la respuesta
  }

  const myRequestParams = {
    method: "GET",
    headers: myHeaders
  };

  fetch(climaURL, myRequestParams)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Datos del clima actual:", data);
    clima.value = data; // guardo los datos en la variable reactiva
  })
   //manejo de error
  .catch(error => {
    console.error("Ocurrió un error:", error);
    errorMsg.value = "No se pudo obtener el clima";
  });
}

//Intentamos obtener la ubicación actual del usuario usando la API de geolocalización del navegador
navigator.geolocation.getCurrentPosition(
  
  //Se ejecuta si el usuario permite compartir su ubicación
  (position) => {
    const lat = position.coords.latitude; 
    const lon = position.coords.longitude;

    obtenerClima(lat, lon);//llamo a la función con coordenadas
  },

  //Se ejecuta si hay un error o el usuario no permite compartir ubicación
  (error) => {
    console.error("No se pudo obtener la ubicación:", error);

    obtenerClima(); // llamo a la función sin coordenadas y usa la ciudad por defecto
  }
);

</script>

<template>
  <div class="w100">
    <div class="w100 vh50">
      <div v-if="clima">
          <h2>{{ clima.location.localtime }}</h2>
          <h2>{{ clima.location.name }}</h2>
          <p>{{ clima.current.condition.text }}</p>
          <p>🌡️ {{ clima.current.temp_c }}°C</p>
          <img :src="clima.current.condition.icon" :alt="clima.current.condition.text">
          <p>Humedad: {{ clima.current.humidity }}%</p>
          <p>Viento: {{ clima.current.wind_kph }} km/h</p>
        </div>

        <div v-else>
          <p>Cargando clima...</p>
        </div>
    </div>
    <div class="w100 vh50 df">
        <div class="w33">Vestimenta<Vestimenta :clima="clima" /></div>
        <div class="w33">Actividades</div>
        <div class="w33">Precauciones</div>
    </div>
  </div>
</template>

<style scoped>
.w100{
  width: 100%;
}
.w33{
  width: 33%;
}
.vh50{
  height: 50vh;
}
.bordeRojo{
  border: 2px solid red;
}
.df{
  display: flex;
}

</style>
