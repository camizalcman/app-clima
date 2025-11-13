<script setup>
import {ref, defineEmits } from 'vue'

//evento que emite este componente
const emit = defineEmits(['buscarUbi'])
const ubicacion = ref('')

//defino la funcion que enviará el dato
function enviarUbicacion() {
  const ciudad = ubicacion.value.trim()
  if (ciudad !== '') {
    emit('buscarUbi', ciudad)
  }
}

</script>
<template>
    <div class="ingresarUbi">
        <input v-model="ubicacion" type="text" name="ubicacion" id="ubi" placeholder="Ingrese su ubicación" @keyup.enter="enviarUbicacion"/>
         <button @click="enviarUbicacion"><font-awesome-icon icon="fa-solid fa-paper-plane" /></button>
    </div>
</template>
<style scoped>
.ingresarUbi{
    display: flex;
     align-items: center; 
    position: relative;
    width: 100%;
}

#ubi{
  width: 100%;
  padding: 0.8em 3em 0.8em 1em;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-family: "Plus Jakarta Sans", sans-serif;
  margin-bottom: 0.8em;
  box-sizing: border-box;
}

button{
  position: absolute;
  right: 0.8em;
  transform: translateY(-30%);
  border: none;
  background: none;
  color:rgb(53, 53, 53);
  cursor: pointer;
  font-size: 1em;
    transition: all 0.3s ease;
}

.ingresarUbi button:hover {
  color: black;
  transform: scale(1.1) translateY(-60%);
}
</style>