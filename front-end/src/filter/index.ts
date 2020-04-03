import Vue from 'vue'
import moment from 'moment'

moment.locale('ko')

Vue.filter('dateformat', (date: Date|number|string) => moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'))
Vue.filter('fromNow', (date: Date|number|string) => moment(new Date(date)).fromNow())
