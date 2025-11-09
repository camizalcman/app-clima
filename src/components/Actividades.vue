<script setup>
//IMPORTS
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

// Actividades por clima
const actFrio = procesarLista(data.actividadesPorClima.frio)
const actTemplado = procesarLista(data.actividadesPorClima.templado)
const actCalor = procesarLista(data.actividadesPorClima.calor)
const actLluvia = procesarLista(data.actividadesPorClima.lluvia)

//PROPS
const props = defineProps({
  clima:Object
})

//computed para definir las actividades a mostrar
const actividadesActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 12) resultado = actFrio
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
  return actividadesActual.value.slice(inicio.value, inicio.value + cantidadVisible);
});

//Botones
const siguiente = () => {
  if (inicio.value + cantidadVisible < actividadesActual.value.length) {
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
    const total = actividadesActual.value.length
    inicio.value = Math.max(total - cantidadVisible, 0)
  }
};
</script>
<template>

    <div class="caja">

        <h2 class="tituloCaja">Actividades recomendadas</h2>

        <div class="galeria">
          <button class="boton" @click="anterior"><font-awesome-icon icon="fa-solid fa-chevron-left" class="iconoBoton"/></button>

          <div class="contenedor">
              <div v-for="(item, index) in itemsVisibles" :key="index" class="item">
                  <img :src="item.img" :alt="item.actividad" width="50" height="50" class="dibujo"/>
                  <p class="textoItem">{{ item.actividad }}</p>
              </div>
          </div>

          <button class="boton" @click="siguiente"><font-awesome-icon icon="fa-solid fa-chevron-right" class="iconoBoton"/></button>
        </div>

    </div>

</template>
<style scoped>

</style>