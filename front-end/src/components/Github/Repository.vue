<template>
  <section class="repository">
    <h2>Repository</h2>
    <ul>
      <li v-for="(v, k) in repo" :key="k">
        <strong>{{v.name}}</strong>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Action, State } from 'vuex-class'
import { FETCH_REPO } from '@/middleware/store/MutationType';
import { ActionMethod } from 'vuex';

@Component
export default class Repository extends Vue {
  @Action(FETCH_REPO) fetchRepo!: ActionMethod
  @State(state => state.github.repository) repo!: Array<Object>

  created () {
    this.fetchRepo()
  }
}
</script>