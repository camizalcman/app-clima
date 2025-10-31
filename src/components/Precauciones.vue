<script setup>
//IMPORTS
import temperatura from '@/assets/img/temperatura.png'
import botellaAgua from '@/assets/img/botella-de-agua.png'
import protector from '@/assets/img/protector-solar.png'
import inundacion from '@/assets/img/inundacion.png'
import '../assets/styles.css'

import { computed } from 'vue'

//PROPS
const props = defineProps({
  clima:Object
})

const precFrio = [{ precaucion: "Evitar cambios bruscos de temperatura", img: temperatura }]

const precTemplado = [{ precaucion: "Mantenerse hidratado durante actividades", img: botellaAgua }]

const precCalor = [{ precaucion: "Usar protector solar y sombrero", img: protector }]

const precLluvia = [{ precaucion: "Evitar zonas con acumulación de agua", img: inundacion }]

//computed para definir las precauciones a mostrar
const precActual = computed(()=>{
  if (!props.clima) return []

  const temp = props.clima.current.temp_c
  let resultado = []

    //Selecciono por temperatura
    if (temp < 15) resultado = precFrio
    else if (temp < 25) resultado = precTemplado
    else resultado = precCalor

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
      resultado = precLluvia
    }

    return resultado
}
)
</script>
<template>
      <div class="caja">
        <h2 class="tituloCaja">Precauciones</h2>
        <div class="contenedor">
            <div v-for="(item, index) in precActual" :key="index" class="itemH">
                <img :src="item.img" :alt="item.precaucion" width="50" height="50" class="dibujo"/>
                <p class="textoItem">{{ item.precaucion }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>


</style>