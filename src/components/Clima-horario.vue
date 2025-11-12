<script setup>
//Import
import { ref, computed } from 'vue';

//PROPS
const props = defineProps({
  clima:Object
})

//Estado del carrusel
const inicio = ref(0);
const cantidadVisible = 4;

const itemsVisibles = computed(() => {
  const horas = props.clima?.forecast?.horaPorHora || [];
  return horas.slice(inicio.value, inicio.value + cantidadVisible);
});

const totalHoras = computed(() => props.clima?.forecast?.horaPorHora?.length || 0);

//Botones
const siguiente = () => {
  if (inicio.value + cantidadVisible < totalHoras.value) {
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
    inicio.value = Math.max(totalHoras.value - cantidadVisible, 0);
  }
};
</script>

<template>

    <!--Armado con galería solo para mobile-->
    <div class="galeria displayNone displayM">
        <button class="boton" @click="anterior"><font-awesome-icon icon="fa-solid fa-chevron-left" class="iconoBoton"/></button>
          <div v-if="clima && clima.forecast" class="contenedorHoras df">
            <div v-for="(item, index) in itemsVisibles" :key="index" class="hora">
              <p>{{ item.hora }}</p>
              <div><img :src="item.icon" width="30" height="30" :class="{ 'iconoRotate': item.icon.includes('day/113.png') && item.temp > 25, 'iconoScale': item.temp < 5, 'iconoSubeBaja': item.icon.includes('176.png')}" /></div>
              <p class="temp">{{ item.temp }}°C</p>        
            </div>
          </div>
          <div v-else>
            <p>Cargando pronóstico...</p>
          </div>
        <button class="boton" @click="siguiente"><font-awesome-icon icon="fa-solid fa-chevron-right" class="iconoBoton"/></button>
    </div>

    <!--Sin galería para tablet y desktop-->
   <div v-if="clima && clima.forecast" class="contenedorHoras df displayNoneM">
      <div v-for="(item, index) in clima.forecast.horaPorHora" :key="index" class="hora">
        <p>{{ item.hora }}</p>
        <div><img :src="item.icon" width="30" height="30" :class="{ 'iconoRotate': item.icon.includes('day/113.png') && item.temp > 25, 'iconoScale': item.temp < 5, 'iconoSubeBaja': item.icon.includes('176.png')}" /></div>
        <p class="temp">{{ item.temp }}°C</p>        
      </div>
    </div>
    <div v-else>
      <p>Cargando pronóstico...</p>
    </div>
</template>
<style scoped>
/*.contenedorHoras{
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1.5em;
}*/

.displayNone{
  display: none;
}
.contenedorHoras {
  display: grid;
  gap: 0.6em;
  margin-top: 1.5em;
  grid-template-columns: repeat(12, 1fr);
    box-sizing: border-box;
  width: 100%;
}

.hora{
  display: flex;
  flex-direction: column;
  background-color: rgba(243, 243, 243, 0.8);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
   width: 100%;
  padding: 0.6em 0;
  justify-content: center;
  align-items: center;
  border-radius:10px;
}

.hora:hover{
  transform: scale(1.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

p{
    font-size: 12px;
}

.temp{
  font-weight:700;
}

/* Computadora chica */
@media (max-width: 1300px){
    .contenedorHoras{
      gap: 0.3em;
    }
}

/* Tablet */
@media (max-width: 1023px){
  .contenedorHoras {
    grid-template-columns: repeat(6, 1fr);
    gap: 1em;
  }
}

/* Mobile */
@media (max-width: 599px) {
  .contenedorHoras {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8em 1.6em;
  }
  .hora{
    padding: 0.2em 0;
  }
  .displayNoneM{
    display: none;
  }
  .displayM{
    display: flex;
  }
}
</style>