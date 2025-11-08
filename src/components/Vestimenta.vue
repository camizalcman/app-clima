<script setup>
import data from '@/data/data.json'
import { ref, computed } from 'vue'
import '../assets/styles.css'

//Convertir las rutas de imagen en URLs reales
const procesarLista = (lista) => {
  return lista.map(item => ({
    ...item,
    //copia todas las propiedades del objeto original y sobrescribe la propiedad img con la URL real de la imagen
    img: new URL(item.img.replace('@/', '/src/'), import.meta.url).href
  }))
}

// Ropa por clima
const ropaFrio = procesarLista(data.ropaPorClima.frio)
const ropaTemplado = procesarLista(data.ropaPorClima.templado)
const ropaCalor = procesarLista(data.ropaPorClima.calor)
const ropaLluvia = procesarLista(data.ropaPorClima.lluvia)

//PROPS
const props = defineProps({
  clima:Object
})



//computed para definir la vestimenta a mostrar
const ropaActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = ropaFrio
    else if (temp < 25) resultado = ropaTemplado
    else resultado = ropaCalor

    //Agregar array de lluvia si hay probabilidad de lluvia
    const textoClima = props.clima.current.condition.text.toLowerCase()
    const lluvia = props.clima.current.precip_mm
    const hayLluvia =
      lluvia > 0 ||
      textoClima.includes("lluvia") ||
      textoClima.includes("chubasco") ||
      textoClima.includes("tormenta") ||
      textoClima.includes("llovizna")

    if (hayLluvia > 0) {
      resultado = [...resultado, ...ropaLluvia]
    }

    return resultado
}
)

//Estado del carrusel
const inicio = ref(0);
const cantidadVisible = 3;

const itemsVisibles = computed(() => {
  return ropaActual.value.slice(inicio.value, inicio.value + cantidadVisible);
});

//Botones
const siguiente = () => {
  if (inicio.value + cantidadVisible < ropaActual.value.length) {
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
    const total = ropaActual.value.length
    inicio.value = Math.max(total - cantidadVisible, 0)
  }
};
</script>

<template>
  <div class="caja">

    <h2 class="tituloCaja">Vestimenta recomendada</h2>

    <div class="galeria">
      <button class="boton" @click="anterior"><font-awesome-icon icon="fa-solid fa-chevron-left" class="iconoBoton"/></button>

      <div class="contenedor">
        <div v-for="(item, index) in itemsVisibles.slice(0,3)" :key="index" class="item">
          <div class="contImg"><img :src="item.img" :alt="item.prenda" width="50" height="50" class="dibujo"/></div>
          <div class="contTexto"><p class="textoItem">{{ item.prenda }}</p></div>
        </div>
      </div>

      <button class="boton" @click="siguiente"><font-awesome-icon icon="fa-solid fa-chevron-right" class="iconoBoton"/></button>
    </div>
  </div>
</template>

<style scoped>




</style>