<script setup>
//IMPORTS
import bufanda from '@/assets/img/bufanda.png'
import guantes from '@/assets/img/guantes.png'
import gorro from '@/assets/img/gorro.png'
import sweater from '@/assets/img/sweater.png'
import remeraML from '@/assets/img/remeraML.png'
import campera from '@/assets/img/campera.png'
import remeraMC from '@/assets/img/remeraMC.png'
import buzo from '@/assets/img/buzo.png'
import jean from '@/assets/img/jean.png'
import camperaFina from '@/assets/img/camperaFina.png'
import zapatillas from '@/assets/img/zapatillas.png'
import chaleco from '@/assets/img/chaleco.png'
import short from '@/assets/img/short.png'
import musculosa from '@/assets/img/musculosa.png'
import gorra from '@/assets/img/gorra.png'
import sandalias from '@/assets/img/sandalias.png'
import vestido from '@/assets/img/vestido.png'
import anteojos from '@/assets/img/anteojos.png'
import piloto from '@/assets/img/piloto.png'
import botasLluvia from '@/assets/img/botasLluvia.png'
import paraguas from '@/assets/img/paraguas.png'

import { computed } from 'vue'

//PROPS
const props = defineProps({
  clima:Object
})

const ropaFrio = [
  { prenda: "Bufanda", img: bufanda },
  { prenda: "Guantes", img: guantes },
  { prenda: "Gorro", img: gorro },
  { prenda: "Sweater", img: sweater },
  { prenda: "Remera manga larga", img: remeraML },
  { prenda: "Campera", img: campera },
];

const ropaTemplado = [
  { prenda: "Remera manga corta", img: remeraMC },
  { prenda: "Buzo liviano", img: buzo },
  { prenda: "Jean", img: jean },
  /*{ prenda: "Campera fina", img: camperaFina },
  { prenda: "Zapatillas", img: zapatillas },
  { prenda: "Chaleco", img: chaleco },*/
];

const ropaCalor = [
  { prenda: "Short", img: short },
  { prenda: "Musculosa", img: musculosa },
  { prenda: "Gorra", img: gorra },
  { prenda: "Sandalias", img: sandalias },
  { prenda: "Vestido", img: vestido },
  { prenda: "Anteojos de sol", img: anteojos }
];

const ropaLluvia = [
  { prenda: "Piloto", img: piloto },
  { prenda: "Botas de lluvia", img: botasLluvia },
  { prenda: "Paraguas", img: paraguas }
]

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