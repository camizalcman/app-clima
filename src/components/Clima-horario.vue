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
        <p>{{ item.temp }}°C</p>
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
  background-color: rgba(235, 235, 235, 0.7);
  border: 1px solid rgb(148, 148, 148);
  transition: transform 0.3s ease;
  padding:0.5em ;
    justify-content: center;
  align-items: center;
    border-radius: 10px;
}

.hora:hover{
  transform: scale(1.06);
}

p{
    font-size: 12px;
}

</style>