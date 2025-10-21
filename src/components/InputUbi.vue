<script setup>
import {ref} from 'vue'

const lugar = ref('')

//evento que emite este componente
const emit = defineEmits(['buscar-clima'])
</script>
<template>
    <div>
        <label for="ubi">Ubicación:</label>
        <input type="text" name="ubicacion" id="ubi" placeholder="Ingrese su ubicación ">
    </div>
</template>