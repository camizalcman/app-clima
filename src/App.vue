<script setup>
import { ref, onMounted } from "vue";
import { computed } from 'vue'
import Vestimenta from './components/Vestimenta.vue'
import Actividades from './components/Actividades.vue'
import PronosticoDiario from "./components/Pronostico-diario.vue";
import climaHorario from "./components/Clima-horario.vue";
import InputUbi from "./components/InputUbi.vue";
import { obtenerClima } from '@/utils/funciones.js'

import frio from '@/assets/img/frio.jpg'
import frioMedio from '@/assets/img/frioMedio.jpg'
import templado from '@/assets/img/templado.jpg'
import soleado from '@/assets/img/soleado.jpg'
import lluvia from '@/assets/img/lluvia.jpg'
import nocheLluvia from '@/assets/img/nocheLluvia.jpg'
import noche from '@/assets/img/noche.jpg'
import Precauciones from "./components/Precauciones.vue";

import './assets/styles.css'


import { CirclesToRhombusesSpinner } from 'epic-spinners'


const cargando = ref(true);

//para actualizar la fecha constantemente
const fechaActual = ref(new Date())

onMounted(() => {
  setInterval(() => {
    fechaActual.value = new Date()
  }, 1000) 
})

const clima = ref(null);

function iniciarApp(){
  cargando.value = true;

  //Intentamos obtener la ubicación actual del usuario usando la API de geolocalización del navegador
  navigator.geolocation.getCurrentPosition(
    
    //Se ejecuta si el usuario permite compartir su ubicación
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      obtenerClima(latitude, longitude).then(data => {
        clima.value = data;
        
        setTimeout(() => {
          cargando.value = false;
        }, 2500);
      });//llamo a la función con coordenadas
    },

    //Se ejecuta si hay un error o el usuario no permite compartir ubicación
    (error) => {
      console.error("No se pudo obtener la ubicación:", error);

      obtenerClima().then(data => {
        clima.value = data;
        cargando.value = false;
      }); // llamo a la función sin coordenadas y usa la ciudad por defecto
    },
    {
      enableHighAccuracy: true, //usa GPS si está disponible
      timeout: 10000,           //espera máximo 10 segundos
      maximumAge: 0             //no usar posición vieja en caché
    }
  );
}

onMounted(() => {
  setInterval(() => {
    fechaActual.value = new Date();
  }, 1000);

  iniciarApp();
});


//Búsqueda de clima por input
function busquedaClimaInput(ciudad) {
  obtenerClima(null, null, ciudad).then(data => {
    clima.value = data
  })
}

const fondoManual = ref(null) //para cambiar desde la consola
window.fondoManual = fondoManual
window.frioMedio = frioMedio
window.frio = frio
window.templado = templado
window.soleado = soleado
window.noche = noche
window.lluvia = lluvia
window.nocheLluvia = nocheLluvia

//Selección de fondos
const fondoActual = computed(() => {
  if (fondoManual.value) return fondoManual.value
  if (!clima.value) return soleado

  const temp = clima.value.current.temp_c
  const precip = clima.value.current.precip_mm
  const textoClima = clima.value.current.condition.text.toLowerCase()
  const hora = new Date().getHours()
  const esNoche = hora > 20 || hora < 7
  console.log(esNoche)
  
  const hayLluvia =
    precip > 0 ||
    textoClima.includes("lluvia") ||
    textoClima.includes("chubasco") ||
    textoClima.includes("tormenta") ||
    textoClima.includes("llovizna")

  
  if (hayLluvia && esNoche) return nocheLluvia
  if (hayLluvia) return lluvia
  if (esNoche) return noche
  if (temp < 5) {
    return frio;
  } else if (temp < 15){
      return frioMedio;
  } else if (temp < 25) {
    return templado;
  } else {
    return soleado;
  }
})

</script>

<template>

  <div v-if="cargando" class="pantallaCarga">
    <img src="/img/mundo.webp" class="planeta" />
    <div class="overlay">
      <p class="tituloCarga">Buscando clima</p>
       <circles-to-rhombuses-spinner
        :animation-duration="1200"
        :circles-num="3"
        :circle-size="15"
        color="#ffff"
      />
    </div>
  </div>
  
   <div v-else class="fondo" :style="{ backgroundImage: `url(${fondoActual})`, backgroundColor:'rgba(29,29,29,0.25)', backgroundBlendMode:'multiply' }">
    <div class="grid-layout">
      
      <div class="item1 estilo-item">
        <div class="contenidoActual">
          <div v-if="clima">
            <div class="df contClima">
              <div>
                <h2 class="lugar"><font-awesome-icon icon="fa-solid fa-location-dot" class="iconUbi"/>{{ clima.location.name }}</h2>
                
               <p class="fecha">
                {{
                   new Date(clima.location.localtime).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })
                }},
                {{
                  new Date(clima.location.localtime).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }}
              </p>

                <div class="df iconoTemp">
                  <img :src="clima.current.condition.icon" :alt="clima.current.condition.text" width="100" height="100" class="iconoClima">
                  <h1 class="tempActual">{{ clima.current.temp_c }}°C</h1>
                </div>
                  <p class="cambioMobile" :class="{ 'textoRojo': clima.current.feelslike_c>30}">Sensación térmica: {{ clima.current.feelslike_c }} °C</p>
                  <p class="cambioMobile">{{ clima.current.condition.text }}</p>
              </div>

              <div class="info">
                <p><font-awesome-icon icon="fa-solid fa-droplet" class="icon" :class="{ 'lluvia': clima.current.humidity>70}"/>Humedad: {{ clima.current.humidity }}%</p>
                <p :class="{ 'textoMov': clima.current.wind_kph>15}"><font-awesome-icon icon="fa-solid fa-wind" class="icon" :class="{ 'viento': clima.current.wind_kph>15}" />Viento: {{ clima.current.wind_kph }} km/h</p>
                <p><font-awesome-icon icon="fa-solid fa-cloud-rain" class="icon" :class="{ 'lluvia': clima.current.precip_mm >0}"/>Precipitación: {{ clima.current.precip_mm }} mm</p>
                <p><font-awesome-icon icon="fa-solid fa-sun" class="icon" :class="{ 'iconoUV': clima.current.uv>5}"/>UV: {{ clima.current.uv }} mm</p>
              </div>

              </div>    
                <div class="horarios"><climaHorario :clima="clima" /></div>
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

.pantallaCarga{
  position: relative; 
  height: 100vh;
  background-image: url("/img/espacio.webp");
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.planeta {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  animation: girar 8s linear infinite;
}

@keyframes girar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.tituloCarga{
  color: white;
  font-size: 2.8em;
  font-weight: 600;
  font-family:"Plus Jakarta Sans", sans-serif;
  margin-bottom: 0.3em; 
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

  .tituloCarga{
    color: white;
    font-size: 2.2em;
    font-weight: 600;
    font-family:"Plus Jakarta Sans", sans-serif;
    margin-bottom: 0.3em; 
  }
}

/* Mobile */
@media (max-width: 767px){
  .tempActual{
    font-size: 2.5em;
    font-weight: 500;
  }
  .iconoClima{
    width: 4em;
    height: 4em;
  }
  .fecha{
    margin-bottom: 0.6em;
    font-size: 0.8em;
  }
  .info{
    margin-right: 0em;
    line-height: 2em;
    font-size: 0.86em;
  }
  .cambioMobile{
    font-size: 0.9em;
  }
  .iconoTemp{
    margin-bottom: 0.6em;
  }
  .tituloCarga{
    color: white;
    font-size: 1.8em;
    font-weight: 600;
    font-family:"Plus Jakarta Sans", sans-serif;
    margin-bottom: 0.3em; 
  }

  .pantallaCarga{
  position: relative; 
  height: 100vh;
  background-image: url("/img/espacio.webp");
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.planeta {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  animation: girar 8s linear infinite;
}
}
</style>
