<script setup>
import {ref} from 'vue'

const lugar = ref('')

//evento que emite este componente
const emit = defineEmits(['buscar-clima'])
</script>
<template>
    <div>
        <input type="text" name="ubicacion" id="ubi" placeholder="Ingrese su ubicación">
        <i class="fa-solid fa-magnifying-glass icono"></i>
    </div>
</template>
<style scoped>
#ubi{
    border-radius: 20px;
    border: 2px;
    padding: 0.8em;
    width: 100%;
    margin-bottom: 2em;
    font-family: "Plus Jakarta Sans", sans-serif;
}
.icono{
    color:black
}
</style>