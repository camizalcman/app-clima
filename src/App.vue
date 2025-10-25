<script setup>
import { ref } from "vue";
import { computed } from 'vue'
import Vestimenta from './components/Vestimenta.vue'
import Actividades from './components/Actividades.vue'
import PronosticoDiario from "./components/Pronostico-diario.vue";

import frio from '@/assets/img/frio.jpg'
import templado from '@/assets/img/templado.jpg'
import soleado from '@/assets/img/soleado.jpg'
import lluvia from '@/assets/img/lluvia.jpg'
import Precauciones from "./components/Precauciones.vue";

import './assets/styles.css'

const clima = ref(null);
const errorMsg = ref("");

const myAPIKey = "8ba418c512314911b0a200932251210";

//Función para obtener clima
function obtenerClima(lat = null, lon = null){

  //armo la URL para llamar a current.json
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
  
    //SEGUNDA LLAMADA - FORECAST.JSON
    const forecastURL = new URL("https://api.weatherapi.com/v1/forecast.json");

    forecastURL.searchParams.append("key", myAPIKey);
    forecastURL.searchParams.append("lang", "es");
    forecastURL.searchParams.append("days", 5);
    forecastURL.searchParams.append("aqi", "no");
    forecastURL.searchParams.append("alerts", "no");

    if (lat !== null && lon !== null) {
      forecastURL.searchParams.append("q", `${lat},${lon}`);
    } else {
      forecastURL.searchParams.append("q", "Buenos Aires");
    }

    return fetch(forecastURL, myRequestParams)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(forecastData => {
        //Informacion de temp por hora
        const hoyHoras = forecastData.forecast.forecastday[0].hour.map(h => ({
          hora: h.time,
          temp: h.temp_c,
          icon: h.condition.icon
        }));
        //Informacion de temp próximos días
        const pronosticoDias = forecastData.forecast.forecastday.map(d => ({
            dia: new Date(d.date).toLocaleDateString('es-AR', { weekday: 'long' }),
            icon: d.day.condition.icon,
            descripcion: d.day.condition.text,
            tempMax: d.day.maxtemp_c,
            tempMin: d.day.mintemp_c
        }));

        clima.value.forecast = {
          horaPorHora: hoyHoras,
          pronostico: pronosticoDias
        };

        console.log("Datos del pronóstico:", clima.value.forecast);
    })

  .catch(error => {
    console.error("Ocurrió un error:", error);
    errorMsg.value = "No se pudo obtener el clima";
  });
})}

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
  if (temp < 15) {
    return frio;
  } else if (temp < 25) {
    return templado;
  } else {
    return soleado;
  }
})

</script>

<template>
  <div class="fondo" :style="{ backgroundImage: `url(${fondoActual})`, backgroundColor:'rgba(0,0,0,0.1)', backgroundBlendMode:'multiply' }">
    <div class="grid-layout">
      
      <div class="item1 estilo-item">
        <div v-if="clima">
            <p>{{ clima.location.localtime }}</p>
            <h2>{{ clima.location.name }}</h2>
            <p>🌡️ {{ clima.current.temp_c }}°C</p>
            <img :src="clima.current.condition.icon" :alt="clima.current.condition.text" width="90" height="90">
            <p>{{ clima.current.condition.text }}</p>
            <p>Humedad: {{ clima.current.humidity }}%</p>
            <p>Viento: {{ clima.current.wind_kph }} km/h</p>
            <p>Precipitación: {{ clima.current.precip_mm }} mm</p>
          </div>

          <div v-else>
            <img src="/src/assets/img/sol.png" alt="sol" width="40" height="40">
            <p>Cargando clima...</p>
          </div>
      </div>

      <div class="item2 estilo-item"><PronosticoDiario :clima="clima" /></div>

      <div class="cajas">
        <div class="item3 estilo-item"><Vestimenta :clima="clima" /></div>
        <div class="item3 estilo-item"><Actividades :clima="clima" /></div>
        <div class="item3 estilo-item"><Precauciones :clima="clima" /></div>
      </div>

    </div>
  </div>
</template>

<style scoped>


</style>
