import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAt, faHome, faHeart as fasHeart, faShareAlt, faReply } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const icons = [ faAt, faHome, faGithub, faEnvelope, fasHeart, farHeart, faShareAlt, faReply ]

library.add(...icons)

Vue.component('fa', FontAwesomeIcon)