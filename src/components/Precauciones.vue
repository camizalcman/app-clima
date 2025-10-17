<script setup>
//IMPORTS


//PROPS
const props = defineProps({
  clima:Object
})

const precFrio = [
  { precaucion: "Usar abrigo y bufanda para evitar resfríos", img: "" },
  { precaucion: "Proteger manos y orejas del frío intenso", img: "" },
  { precaucion: "Evitar cambios bruscos de temperatura", img: "" },
]

const precTemplado = [
  { precaucion: "Llevar abrigo liviano por si refresca", img: "" },
  { precaucion: "Usar protector solar si vas a estar al aire libre", img: "" },
  { precaucion: "Mantenerse hidratado durante actividades", img: "" },
]

const precCalor = [
  { precaucion: "Evitar exposición al sol en horas pico", img: "" },
  { precaucion: "Tomar mucha agua para evitar deshidratación", img: "" },
  { precaucion: "Usar protector solar y sombrero", img: "" },
]

const precLluvia = [
  { precaucion: "Evitar zonas con acumulación de agua", img: "" },
  { precaucion: "No dejar objetos eléctricos expuestos al agua", img: "" },
    { precaucion: "Usar ropa impermeable y calzado adecuado", img: "" },
]
</script>
<template>

</template>
