<script setup>

//PROPS
const props = defineProps({
  clima:Object
})
</script>

<template>
   <div v-if="clima && clima.forecast">
      <div v-for="(item, index) in clima.forecast.pronostico" :key="index">
        <p><img :src="item.icon" />{{ item.dia }} - {{ item.descripcion }} - {{ item.tempMax }}°C / {{ item.tempMin }}°C</p>
      </div>
    </div>
    <div v-else>
      <p>Cargando pronóstico...</p>
    </div>
</template>