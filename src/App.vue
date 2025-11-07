<script setup>
import { ref, onMounted } from "vue";
import { computed } from 'vue'
import Vestimenta from './components/Vestimenta.vue'
import Actividades from './components/Actividades.vue'
import PronosticoDiario from "./components/Pronostico-diario.vue";
import climaHorario from "./components/Clima-horario.vue";
import InputUbi from "./components/InputUbi.vue";

import frio from '@/assets/img/frio.jpg'
import templado from '@/assets/img/templado.jpg'
import soleado from '@/assets/img/soleado.jpg'
import lluvia from '@/assets/img/lluvia.jpg'
import Precauciones from "./components/Precauciones.vue";

import './assets/styles.css'

//para actualizar la fecha constantemente
const fechaActual = ref(new Date())

onMounted(() => {
  setInterval(() => {
    fechaActual.value = new Date()
  }, 1000) 
})



const clima = ref(null);
const errorMsg = ref("");

const myAPIKey = "8ba418c512314911b0a200932251210";

//Función para obtener clima
function obtenerClima(lat = null, lon = null, ciudad=null){

  //armo la URL para llamar a current.json
  const climaURL = new URL("https://api.weatherapi.com/v1/current.json");
  
  //parámetros
  climaURL.searchParams.append("key", myAPIKey);    
  climaURL.searchParams.append("lang", "es");

  //Si están las coordenadas coordenadas, uso lat y lon, sino uso la ciudad por defecto
  if (lat !== null && lon !== null) {
    climaURL.searchParams.append("q", `${lat},${lon}`);
  } else if (ciudad){
    climaURL.searchParams.append("q", ciudad);
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
    forecastURL.searchParams.append("days", 6);
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
        const hoyHoras = forecastData.forecast.forecastday[0].hour
        .map(h => ({
          hora: h.time.split(" ")[1],
          temp: h.temp_c,
          icon: h.condition.icon
        }))
           .filter((_, i) => i % 2 === 0);
        
        //Informacion de temp próximos días
        const pronosticoDias = forecastData.forecast.forecastday
        .slice(0, 5) 
        .map(d => ({
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

//Búsqueda de clima por input
function busquedaClimaInput(ciudad) {
  obtenerClima(null, null, ciudad)
}

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
  <div class="fondo" :style="{ backgroundImage: `url(${fondoActual})`, backgroundColor:'rgba(29,29,29,0.25)', backgroundBlendMode:'multiply' }">
    <div class="grid-layout">
      
      <div class="item1 estilo-item">
        <div class="contenidoActual">
          <div v-if="clima">
            <div class="df contClima">
              <div>
                <h2 class="lugar"><font-awesome-icon icon="fa-solid fa-location-dot" class="iconUbi"/>{{ clima.location.name }}</h2>
                
               <p class="fecha">
                {{
                  new Date().toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })
                }},
                {{
                  new Date().toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }}
              </p>

                <div class="df iconoTemp">
                  <img :src="clima.current.condition.icon" :alt="clima.current.condition.text" width="100" height="100" class="iconoClima">
                  <h1 class="tempActual">{{ clima.current.temp_c }}°C</h1>
                </div>
                  <p>Sensación térmica: {{ clima.current.feelslike_c }} °C</p>
                  <p>{{ clima.current.condition.text }}</p>
              </div>

              <div class="info">
                <p><font-awesome-icon icon="fa-solid fa-droplet" class="icon"/>Humedad: {{ clima.current.humidity }}%</p>
                <p><font-awesome-icon icon="fa-solid fa-wind" class="icon"/>Viento: {{ clima.current.wind_kph }} km/h</p>
                <p><font-awesome-icon icon="fa-solid fa-cloud-rain" class="icon"/>Precipitación: {{ clima.current.precip_mm }} mm</p>
                <p><font-awesome-icon icon="fa-solid fa-sun" class="icon"/>UV: {{ clima.current.uv }} mm</p>
              </div>

              </div>    
                <div class="horarios"><climaHorario :clima="clima" /></div>
              </div>
            
          <div v-else>
            <img src="/src/assets/img/sol.png" alt="sol" width="40" height="40">
            <p>Cargando clima...</p>
          </div>
        </div>
      </div>

      <div class="item2 estilo-item"><div class="w90 contenedorPronostico"> <InputUbi @buscarUbi="busquedaClimaInput" /><PronosticoDiario :clima="clima" /></div></div>

      <div class="cajas">
        <div class="item3 estilo-item"><Vestimenta :clima="clima" /></div>
        <div class="item3 estilo-item"><Actividades :clima="clima" /></div>
        <div class="item3 estilo-item"><Precauciones :clima="clima" /></div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.contClima{
  display: flex;
  justify-content: space-between;
}
.lugar{
  font-weight: 600;
}
.horarios{
  margin-top: 1em;
}
.tempActual{
  font-size: 3.4em;
  font-weight: 500;
}
.iconoTemp{
  align-items: center;
}

.fecha{
  margin-bottom: 1em;
  font-size: 1em;
}

.iconoClima{
  animation: flotar 3s ease-in-out infinite;
}

@keyframes flotar {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

.info{
  margin-right: 1em;
  line-height: 2em;
}

.contenidoActual{
  width: 95%;
}

.contenedorPronostico{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.fondo {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;            
  justify-content: center;   
  align-items: center; 
  overflow: hidden;
}

.grid-layout{
  display: grid;
  width: 88%;
  max-height: 96vh;
  grid-template-columns: repeat(3, 1fr); 
  grid-template-rows: auto auto;
  gap: 1em;
  box-sizing: border-box;
}

.item1{
  grid-column: 1 / span 2; 
  grid-row: 1; 
  display: grid;         
  justify-items: center;
}

.item2 {
  grid-column: 3; 
  grid-row: 1;
  display: grid;         
  justify-items: center;
}

.cajas{
  grid-column: 1 / span 3; 
  display: flex;
  justify-content: space-between;
  gap: 1em;
  flex-wrap: wrap;
}

.estilo-item{
  background-color: rgba(245, 245, 245, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1em 0em;
  border-radius: 1em;
  color: rgb(29, 29, 29);
  font-family: "Plus Jakarta Sans", sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.item3{
  flex: 1;
}


/* Tablet */
@media (max-width: 1023px) {
    .grid-layout {
    grid-template-columns: 1fr;
    padding-top: 2em;
    padding-bottom: 2em;
    max-height: none;  
  }
  .item1,
  .item2,
  .cajas {
    grid-column: 1;
    grid-row: auto;
  }

   .cajas {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

   .fondo {
    height: auto;          
    min-height: 100vh;     
    overflow: auto;        
    align-items: flex-start; 
  }

  .item3{
    width: 100%;
  }

  .item1{
    padding: 1.2em 0.6em;
  }
}

/* Mobile */
@media (max-width: 767px){
  
}
</style>
