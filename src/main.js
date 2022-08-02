import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowUpRightFromSquare);




const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon);


app.mount('#app')


