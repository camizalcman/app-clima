import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faDroplet, faWind, faCloudRain, faSun, faLocationDot,  } from '@fortawesome/free-solid-svg-icons'

library.add(
  faPaperPlane,
  faDroplet,
  faWind,
  faCloudRain,
  faSun,
  faLocationDot,
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
