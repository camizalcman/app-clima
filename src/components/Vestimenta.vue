<script setup>
//IMPORTS


//PROPS
const props = defineProps({
  clima:Object
})

const ropaFrio = [
  { prenda: "Bufanda", img: "https://example.com/bufanda.png" },
  { prenda: "Guantes", img: "https://example.com/guantes.png" },
  { prenda: "Gorro", img: "https://example.com/gorro.png" },
  { prenda: "Suéter", img: "https://example.com/sueter.png" },
  { prenda: "Remera manga larga", img: "https://example.com/remera_manga_larga.png" },
  { prenda: "Campera", img: "https://example.com/campera.png" },
  { prenda: "Pantalones térmicos", img: "https://example.com/pantalones_termicos.png" }
];
</script>

<template>
    <div v-if="clima">
        <h2>Ropa recomendada para clima frío:</h2>
        <div class="ropa-frio">
            <div v-for="(item, index) in ropaFrio" :key="index" class="item">
                <img :src="item.img" :alt="item.prenda" width="100" height="100"/>
                <p>{{ item.prenda }}</p>
            </div>
        </div>
      
  </div>
</template>

<style scoped>
.bordeRojo{
    border: 2px solid red;
}
</style>