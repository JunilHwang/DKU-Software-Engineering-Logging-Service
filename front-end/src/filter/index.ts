import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', (date: Date) => moment(date).format('YYYY-MM-DD HH:mm:ss'))