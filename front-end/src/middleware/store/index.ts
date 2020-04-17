import Vue from 'vue'
import {default as Vuex, Store, StoreOptions} from 'vuex'
import user from './user'
import github from './github'
import post from './post'
import comment from './comment'
import { RootState } from './types'

Vue.use(Vuex)

export const createStore = (context: { [k: string]: string }) => {
  const state: RootState = { ...context }
  const mutations = { }
  const actions = { }
  const modules = { user, github, post, comment }
  const storeOption: StoreOptions<RootState> = { state, mutations, actions, modules }
  return new Vuex.Store<RootState>(storeOption)
}

export const store: Store<RootState> = createStore({ })