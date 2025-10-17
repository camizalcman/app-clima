<script setup>
//IMPORTS
import chocolate from '@/assets/img/chocolate.png'
import cine from '@/assets/img/cine.png'
import museo from '@/assets/img/museo.png'
import picnic from '@/assets/img/picnic.png'
import bicicleta from '@/assets/img/bicicleta.png'
import caminar from '@/assets/img/caminar.png'
import playa from '@/assets/img/playa.png'
import pileta from '@/assets/img/pileta.png'
import helado from '@/assets/img/helado.png'
import pelicula from '@/assets/img/pelicula.png'
import cocinar from '@/assets/img/cocinar.png'
import juegoDeMesa from '@/assets/img/juegoDeMesa.png'

import { computed } from 'vue'

//PROPS
const props = defineProps({
  clima:Object
})

const actFrio = [
  { actividad: "Tomar chocolate caliente", img: chocolate },
  { actividad: "Ir al cine", img: cine },
  { actividad: "Visitar un museo", img: museo }
]

const actTemplado = [
  { actividad: "Hacer picnic", img: picnic },
  { actividad: "Andar en bicicleta", img: bicicleta },
  { actividad: "Caminar al aire libre", img: caminar },
]

const actCalor = [
  { actividad: "Ir a la playa", img: playa },
  { actividad: "Nadar en la pileta", img: pileta },
  { actividad: "Tomar helado", img: helado },
]

const actLluvia = [
  { actividad: "Ver una película en casa", img: pelicula },
  { actividad: "Cocinar algo rico", img: cocinar },
  { actividad: "Jugar juegos de mesa", img: juegoDeMesa },
]

//computed para definir las actividades a mostrar
const actividadesActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = actFrio
    else if (temp < 25) resultado = actTemplado
    else resultado = actCalor

    //Si llueve
    const textoClima = props.clima.current.condition.text.toLowerCase()
    const lluvia = props.clima.current.precip_mm
    const hayLluvia =
      lluvia > 0 ||
      textoClima.includes("lluvia") ||
      textoClima.includes("chubasco") ||
      textoClima.includes("tormenta") ||
      textoClima.includes("llovizna")

    if (hayLluvia) {
      resultado = actLluvia
    }

    return resultado
}
)
</script>
<template>
      <div class="caja">
        <h2>Actividades recomendadas</h2>
        <div class="contenedor">
            <div v-for="(item, index) in actividadesActual" :key="index" class="item">
                <img :src="item.img" :alt="item.actividad" width="80" height="80"/>
                <p>{{ item.actividad }}</p>
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

.caja{
    background-color: rgba(232, 243, 242, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  padding: 2em;
  border-radius: 1em;
}
</style>