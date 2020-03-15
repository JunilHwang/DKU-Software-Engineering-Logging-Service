<template>
  <main id="user">
    <div class="container">
      <header class="userProfile" v-if="user !== null">
        <figure class="userProfileImage">
          <img :src="user.profile.avatar_url" :alt="user.profile.login" width="100" />
        </figure>
        <div class="userProfileInfo">
          <p v-html="user.id" />
          <p v-html="user.profile.email" />
        </div>
      </header>
      <post-list :data="postList" />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PostList } from '@/components'
import { Action, State } from 'vuex-class'
import { Post, User as UserType } from '@Domain'
import { FETCH_USER_POST, FETCH_USER } from '@/middleware/store/types'
import { ActionMethod } from 'vuex'
import { eventBus } from '@/helper'

const components = { PostList }

@Component({ components })
export default class User extends Vue {

  @State(state => state.user.posts) postList!: Post[]
  @State(state => state.user.user) user!: UserType|null
  @Action(FETCH_USER_POST) fetchUserPost!: ActionMethod
  @Action(FETCH_USER) fetchUser!: ActionMethod

  fetchPost () {
    this.fetchUserPost(this.$route.params.userId)
  }

  created () {
    this.fetchUser(this.$route.params.userId)
    this.fetchPost()

    eventBus.$on('fetchPostAll', this.fetchPost)

  }

}
</script>

<style lang="scss">
@import "../assets/scss/lib";
.user {
  &Profile {
    &Image {
      @include img-wrap();
      @include circle(100px);
      overflow: hidden;
    }
  }
}
</style>