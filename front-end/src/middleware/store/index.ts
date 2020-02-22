import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import github from './github'

Vue.use(Vuex)

const modules = { user, github }
const state = { }
const mutations = { }
const actions = { }

export default new Vuex.Store({ modules, state, mutations, actions })
