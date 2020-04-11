import Vue from 'vue'
import { default as Vuex, StoreOptions } from 'vuex'
import user from './user'
import github from './github'
import post from './post'
import comment from './comment'
import { RootState } from './types'

Vue.use(Vuex)

const state: RootState = { }
const mutations = { }
const actions = { }
const modules = { user, github, post, comment }

const store: StoreOptions<RootState> = { state, mutations, actions, modules }

export default new Vuex.Store<RootState>(store)
