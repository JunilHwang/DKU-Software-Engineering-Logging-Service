import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', (date: Date|number|string) => moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'))