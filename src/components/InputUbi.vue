<script setup>
import {ref, defineEmits } from 'vue'


//evento que emite este componente
const emit = defineEmits(['buscarUbi'])
const ubicacion = ref('')

//defino la funcion que enviará el dato
function enviarUbicacion() {
    if(ubicacion.value.trim !==" "){
        emit('buscarUbi', ubicacion.value)
    }
}


</script>
<template>
    <div class="ingresarUbi">
        <input type="text" name="ubicacion" id="ubi" placeholder="Ingrese su ubicación" @keyup.enter="enviarUbicacion"/>
         <button @click="enviarUbicacion"><font-awesome-icon icon="fa-solid fa-paper-plane" /></button>
    </div>
    
</template>
<style scoped>
.ingresarUbi{
    width: 100%;
    display: flex;
    justify-content: space-between;
}

#ubi{
    border-radius: 20px;
    border: 1px;
    padding: 0.8em;
    margin-bottom: 2em;
    font-family: "Plus Jakarta Sans", sans-serif;
    width: 86%;
}
button{
    border: black;
    background-color:  rgb(73, 73, 73);
   color: rgb(255, 255, 255);
   padding: 0.8em;
   border-radius: 20px;
   width: 10%;
   height: 100%;

}
</style>