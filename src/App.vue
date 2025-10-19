<script setup>
import { ref } from "vue";
import { computed } from 'vue'
import Vestimenta from './components/Vestimenta.vue'
import Actividades from './components/Actividades.vue'

import frio from '@/assets/img/frio.jpg'
import templado from '@/assets/img/templado.jpg'
import soleado from '@/assets/img/soleado.jpg'
import lluvia from '@/assets/img/lluvia.jpg'
import Precauciones from "./components/Precauciones.vue";

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
    const { latitude, longitude, accuracy } = position.coords;
    
    obtenerClima(latitude, longitude);//llamo a la función con coordenadas
  },

  //Se ejecuta si hay un error o el usuario no permite compartir ubicación
  (error) => {
    console.error("No se pudo obtener la ubicación:", error);

    obtenerClima(); // llamo a la función sin coordenadas y usa la ciudad por defecto
  },
  {
    enableHighAccuracy: true, //usa GPS si está disponible
    timeout: 10000,           //espera máximo 10 segundos
    maximumAge: 0             //no usar posición vieja en caché
  }
);

//Selección de fondos
const fondoActual = computed(() => {
  if (!clima.value) return soleado

  const temp = clima.value.current.temp_c
  const precip = clima.value.current.precip_mm
  const textoClima = clima.value.current.condition.text.toLowerCase()
  const hayLluvia =
    precip > 0 ||
    textoClima.includes("lluvia") ||
    textoClima.includes("chubasco") ||
    textoClima.includes("tormenta") ||
    textoClima.includes("llovizna")

  if (hayLluvia) return lluvia
  if (temp < 15) return frio
  else if (temp < 25) return templado
  else return soleado
})

</script>

<template>
  <div class="fondo" :style="{ backgroundImage: `url(${fondoActual})` }">
    <div class="grid-layout">
      
      <div class="item1 estilo-item">
        <div v-if="clima">
            <h2>{{ clima.location.localtime }}</h2>
            <h2>{{ clima.location.name }}</h2>
            <p>{{ clima.current.condition.text }}</p>
            <p>🌡️ {{ clima.current.temp_c }}°C</p>
            <img :src="clima.current.condition.icon" :alt="clima.current.condition.text">
            <p>Humedad: {{ clima.current.humidity }}%</p>
            <p>Viento: {{ clima.current.wind_kph }} km/h</p>
            <p>Precipitación: {{ clima.current.precip_mm }} mm</p>
          </div>

          <div v-else>
            <p>Cargando clima...</p>
          </div>
      </div>

      <div class="item2 estilo-item"></div>

      <div class="cajas">
        <div class="item3 estilo-item"><Vestimenta :clima="clima" /></div>
        <div class="item3 estilo-item"><Actividades :clima="clima" /></div>
        <div class="item3 estilo-item"><Precauciones :clima="clima" /></div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fondo {
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;            
  justify-content: center;   
  align-items: center;       
}

.grid-layout{
  display: grid;
  width: 96%;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr); 
  grid-template-rows: repeat(2, 1fr); 
  gap: 1em;
}

.item1{
  grid-column: 1 / span 2; 
  grid-row: 1;
}

.item2 {
  grid-column: 3; 
  grid-row: 1;
}

.cajas{
  grid-column: 1 / span 3; 
  display: flex;
  justify-content: space-between;
  gap: 1em;
  margin-top: 10px;
}

.estilo-item{
  background-color: rgba(232, 243, 242, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  padding: 2em;
  border-radius: 1em;
  color: rgb(23, 23, 23);
}

.item3{
  flex: 1;
}


</style>
