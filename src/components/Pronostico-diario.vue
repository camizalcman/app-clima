<script setup>

//PROPS
const props = defineProps({
  clima:Object
})
</script>

<template>
   <div v-if="clima && clima.forecast" class="contPronostico w100">
      <div v-for="(item, index) in clima.forecast.pronostico" :key="index" class="pronostico">
        <div class="df w100">
            <div class="icono"><img :src="item.icon" width="50" height="50" /></div>
            <div class="textoPronostico">
              <div><p class="dia">{{ item.dia }} <br><p>{{ item.descripcion }}</p></br></p></div>
              <div class="temp"><p>{{ item.tempMax }}° <br>{{ item.tempMin }}°</br></p></div>
            </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Cargando pronóstico...</p>
    </div>
</template>
<style scoped>
.contPronostico{
  display: flex;
  flex-direction: column;
  gap: 1.6em;
}
.pronostico{
  width: 100%;
}
.icono{
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  background-color: rgba(235, 235, 235, 0.7);
  border: 1px solid rgb(148, 148, 148);
  border-radius: 10px;
  margin-right: 0.8em;
}
.item:hover{
  transform: scale(1.06);
}
.textoPronostico{
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.temp{
  text-align: right;
  padding-left: 1em;
  position: relative;
}

.temp::before {
  content: "";             
  height: 90%;            
  width: 2px;              
  background-color: black;
  position: absolute;
  left: 0;               
  top: 0;
}
.dia{
  font-weight: bold;
  text-transform: capitalize;
}


</style>