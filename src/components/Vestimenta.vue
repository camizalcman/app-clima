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
      <div v-for="(item, index) in ropaActual" :key="index" class="item">
        <img :src="item.img" :alt="item.prenda" width="80" height="80"/>
        <p>{{ item.prenda }}</p>
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
  width: 33%;
}

.contenedor{
  display: flex;
  flex-wrap: wrap;
}

</style>