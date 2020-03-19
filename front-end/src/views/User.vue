<template>
  <main id="user">
    <div class="container">
      <header class="userProfile" v-if="user !== null">
        <figure class="userProfileImage">
          <img :src="user.profile.avatar_url" :alt="user.profile.login" width="100" />
        </figure>
        <div class="userProfileInfo">
          <p class="userProfileName">
            @{{ user.id }}
          </p>
          <p class="userProfileEmail">
            <fa :icon="['far', 'envelope']" /> {{ user.profile.email }}
          </p>
          <a :href="user.profile.html_url" target="_blank" class="userProfileGithub">
            <fa :icon="['fab', 'github']" /> {{ user.profile.html_url }}
          </a>
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
    font-family: enFont();
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px dotted #ddd;

    p {
      line-height: 1;
      margin: 0;
      letter-spacing: -0.5px;
    }

    &Image {
      @include img-wrap();
      @include circle(100px);
      overflow: hidden;
      margin: 0 20px 0 0;
      padding: 0;
    }

    &Name {
      font-size: 25px;
      font-weight: 300;
      padding-bottom: 10px;
      transform: translateX(-3px);
      color: #06F
    }

    &Email {
      padding-bottom: 5px;
    }
  }
}
</style>