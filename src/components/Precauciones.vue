<script setup>
//IMPORTS
import data from '@/data/data.json'
import '../assets/styles.css'
import { ref, computed } from 'vue'

//Convertir las rutas de imagen en URLs reales
const procesarLista = (lista) => {
  return lista.map(item => ({
    ...item,
    //copia todas las propiedades del objeto original y sobrescribe la propiedad img con la URL real de la imagen
    img: new URL(item.img.replace('@/', '/src/'), import.meta.url).href
  }))
}

// Precauciones por clima
const precFrio = procesarLista(data.precaucionesPorClima.frio)
const precTemplado = procesarLista(data.precaucionesPorClima.templado)
const precCalor = procesarLista(data.precaucionesPorClima.calor)
const precLluvia = procesarLista(data.precaucionesPorClima.lluvia)

//PROPS
const props = defineProps({
  clima:Object
})

//computed para definir las precauciones a mostrar
const precActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = precFrio
    else if (temp < 25) resultado = precTemplado
    else resultado = precCalor

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
      resultado = precLluvia
    }

    return resultado
}
)

//Estado del carrusel
const inicio = ref(0);
const cantidadVisible = 1;

const itemsVisibles = computed(() => {
  return precActual.value.slice(inicio.value, inicio.value + cantidadVisible);
});

//Botones
const siguiente = () => {
  if (inicio.value + cantidadVisible < precActual.value.length) {
    inicio.value += cantidadVisible; //avanza la cantidad de posiciones que se están mostrando 
  } else {
    //Si llego al final vuelvo al inicio
    inicio.value = 0
  }
};

const anterior = () => {
  if (inicio.value - cantidadVisible >= 0) {
    inicio.value -= cantidadVisible;
  } else {
    //Si estoy en el inicio, voy al final
    const total = precActual.value.length
    inicio.value = Math.max(total - cantidadVisible, 0)
  }
};
</script>
<template>
      <div class="caja">

        <h2 class="tituloCaja">Precauciones</h2>

        <div class="galeria">
          <button class="boton" @click="anterior"><font-awesome-icon icon="fa-solid fa-chevron-left" class="iconoBoton"/></button>

          <div class="contenedor">
              <div v-for="(item, index) in precActual" :key="index" class="itemH">
                  <img :src="item.img" :alt="item.precaucion" width="50" height="50" class="dibujo"/>
                  <p class="textoItem">{{ item.precaucion }}</p>
              </div>
          </div>
          
          <button class="boton" @click="siguiente"><font-awesome-icon icon="fa-solid fa-chevron-right" class="iconoBoton"/></button>
        </div>
    </div>
</template>

<style scoped>


</style>