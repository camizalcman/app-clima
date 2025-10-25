<script setup>
import ropa from '@/data/ropa.json'
import { computed } from 'vue'

//Convertir las rutas de imagen en URLs reales
const procesarRopa = (lista) => {
  return lista.map(item => ({
    ...item,
    //copia todas las propiedades del objeto original y sobrescribe la propiedad img con la URL real de la imagen
    img: new URL(item.img.replace('@/', '/src/'), import.meta.url).href
  }))
}

const ropaFrio = procesarRopa(ropa.frio)
const ropaTemplado = procesarRopa(ropa.templado)
const ropaCalor = procesarRopa(ropa.calor)
const ropaLluvia = procesarRopa(ropa.lluvia)

//PROPS
const props = defineProps({
  clima:Object
})



//computed para definir la vestimenta a mostrar
const ropaActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = ropaFrio
    else if (temp < 25) resultado = ropaTemplado
    else resultado = ropaCalor

    //Agregar array de lluvia si hay probabilidad de lluvia
    const textoClima = props.clima.current.condition.text.toLowerCase()
    const lluvia = props.clima.current.precip_mm
    const hayLluvia =
      lluvia > 0 ||
      textoClima.includes("lluvia") ||
      textoClima.includes("chubasco") ||
      textoClima.includes("tormenta") ||
      textoClima.includes("llovizna")

    if (hayLluvia > 0) {
      resultado = [...resultado, ...ropaLluvia]
    }

    return resultado
}
)
</script>

<template>
  <div class="caja">
    <h2>Vestimenta recomendada</h2>
    <div class="contenedor">
      <div v-for="item in ropaActual.slice(0,3)" :key="index" class="item">
        <div class="contImg"><img :src="item.img" :alt="item.prenda" width="50" height="50"/></div>
        <div class="contTexto"><p>{{ item.prenda }}</p></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.bordeRojo{
    border: 2px solid red;
}

.item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 31%;
  transition: transform 0.3s ease;
  border: 2px solid rgb(94, 94, 94);
  background-color: rgb(94, 94, 94,0.3);
  border-radius: 10px;
  padding: 0.5em;
}

.item:hover{
  transform: scale(1.06);
}

.contenedor{
  display: flex;
  align-items: center;
  justify-content: space-between;
} 

.caja{
  font-family: "Plus Jakarta Sans", sans-serif;
}

h2{
  font-weight: 500;
  font-size: 1.4em;
  margin-bottom: 1em
}

p{
  font-weight: 500;
  font-size: 0.9em;
  line-height: 1.2em;
  margin-top: 0.4em;
}


</style>