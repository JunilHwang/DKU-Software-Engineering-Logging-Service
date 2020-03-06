import { Module } from 'vuex'
import {ADD_POST, FETCH_POST, FETCH_POST_LIST, RootState} from '@/middleware/store/types'
import {PostVO} from "@Domain";

type PostState = any

const state = {}

const mutations = {}

const actions = {
  [ADD_POST]: ({ commit }: PostState, {}: PostVO) => {

  },
  [FETCH_POST]: ({ commit }: PostState, idx: number) => {

  },
  [FETCH_POST_LIST]: ({ commit }: PostState) => {

  },
}

const PostModule: Module<PostState, RootState> = { state, mutations, actions }

export default PostModule