<script setup>
//IMPORTS
import chocolate from '@/assets/img/chocolate.png'
import cine from '@/assets/img/cine.png'
import museo from '@/assets/img/museo.png'
import picnic from '@/assets/img/picnic.png'
import bicicleta from '@/assets/img/bicicleta.png'
import caminar from '@/assets/img/caminar.png'
import playa from '@/assets/img/playa.png'
import pileta from '@/assets/img/pileta.png'
import helado from '@/assets/img/helado.png'
import pelicula from '@/assets/img/pelicula.png'
import cocinar from '@/assets/img/cocinar.png'
import juegoDeMesa from '@/assets/img/juegoDeMesa.png'

import '../assets/styles.css'

import { ref, computed } from 'vue'

//PROPS
const props = defineProps({
  clima:Object
})

const actFrio = [
  { actividad: "Tomar chocolate caliente", img: chocolate },
  { actividad: "Ir al cine", img: cine },
  { actividad: "Visitar un museo", img: museo },
]

const actTemplado = [
  { actividad: "Hacer picnic con amigos", img: picnic },
  { actividad: "Andar en bicicleta", img: bicicleta },
  { actividad: "Caminar al aire libre", img: caminar },
]

const actCalor = [
  { actividad: "Ir a la playa", img: playa },
  { actividad: "Ir a la pileta", img: pileta },
  { actividad: "Tomar helado", img: helado },
]

const actLluvia = [
  { actividad: "Ver una película", img: pelicula },
  { actividad: "Cocinar algo rico", img: cocinar },
  { actividad: "Jugar juegos de mesa", img: juegoDeMesa },
]


//computed para definir las actividades a mostrar
const actividadesActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = actFrio
    else if (temp < 25) resultado = actTemplado
    else resultado = actCalor

    //Si llueve
    const textoClima = props.clima.current.condition.text.toLowerCase()
    const lluvia = props.clima.current.precip_mm
    const hayLluvia =
      lluvia > 0 ||
      textoClima.includes("lluvia") ||
      textoClima.includes("chubasco") ||
      textoClima.includes("tormenta") ||
      textoClima.includes("llovizna")

    if (hayLluvia) {
      resultado = actLluvia
    }

    return resultado
}
)

//Estado del carrusel
const inicio = ref(0);
const cantidadVisible = 3;

const itemsVisibles = computed(() => {
  return actividadesActual.slice(inicio.value, inicio.value + cantidadVisible);
});

//Botones
const siguiente = () => {
  if (inicio.value + cantidadVisible < actividadesActual.value.length) {
    inicio.value += cantidadVisible; //avanza la cantidad de posiciones que se están mostrando 
  }
};

const anterior = () => {
  if (inicio.value - cantidadVisible >= 0) {
    inicio.value -= cantidadVisible;
  }
};
</script>
<template>

    <div class="caja">

        <h2 class="tituloCaja">Actividades recomendadas</h2>

        <div class="galeria">
          <button class="boton" @click="anterior"><</button>

          <div class="contenedor">
              <div v-for="(item, index) in actividadesActual" :key="index" class="item">
                  <img :src="item.img" :alt="item.actividad" width="50" height="50" class="dibujo"/>
                  <p class="textoItem">{{ item.actividad }}</p>
              </div>
          </div>

          <button class="boton" @click="siguiente">></button>
        </div>

    </div>

</template>
<style scoped>

</style>