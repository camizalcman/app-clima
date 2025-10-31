<script setup>

//PROPS
const props = defineProps({
  clima:Object
})
</script>

<template>
   <div v-if="clima && clima.forecast" class="contenedorHoras df">
      <div v-for="(item, index) in clima.forecast.horaPorHora" :key="index" class="hora">
        <p>{{ item.hora }}</p>
        <div><img :src="item.icon" width="30" height="30" /></div>
        <p class="temp">{{ item.temp }}°C</p>
      </div>
    </div>
    <div v-else>
      <p>Cargando pronóstico...</p>
    </div>
</template>
<style scoped>
.contenedorHoras{
  flex-wrap: wrap;
  justify-content: space-between;
}

.hora{
  display: flex;
  flex-direction: column;
  background-color: rgba(243, 243, 243, 0.8);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  width: 3.8em;
  padding: 0.6em 0;
    justify-content: center;
  align-items: center;
    border-radius:10px;
}

.hora:hover{
  transform: scale(1.06);
}

p{
    font-size: 12px;
}

.temp{
  font-weight:600;
}
</style>