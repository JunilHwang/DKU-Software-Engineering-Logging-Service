<template>
  <main id="user">
    <div class="container">
      <header class="userProfile" v-if="user !== null">
        <figure class="userProfileImage">
          <img :src="user.profile.avatar_url" :alt="user.profile.login" width="100" />
        </figure>
        <div class="userProfileInfo">
          <div class="userProfileInfoHeader">
            <p class="userProfileName" v-html="`@${user.id}`" />
            <p class="userProfileBio" v-html="user.profile.bio" />
          </div>
          <p class="userProfileEmail" v-if="user.profile.email">
            <span class="userProfileIcon"><fa :icon="['far', 'envelope']" /></span>
            {{ user.profile.email }}
          </p>
          <p class="userProfileGithub" v-if="user.profile.html_url">
            <a :href="user.profile.html_url" target="_blank">
              <span class="userProfileIcon"><fa :icon="['fab', 'github']" /></span>
              {{ user.profile.html_url }}
            </a>
          </p>
          <p class="userProfileHome" v-if="user.profile.blog">
            <a :href="user.profile.blog" target="_blank" class="userProfileGithub">
              <span class="userProfileIcon"><fa :icon="['fas', 'home']" /></span>
              {{ user.profile.blog }}
            </a>
          </p>
        </div>
        <ul class="userProfileNumbers">
          <li>
            <el-button type="default" v-html="postList.length" circle plain />
            <span>게시물</span>
          </li>
          <li>
            <el-button type="default" v-html="user.profile.followers" circle plain />
            <span>팔로워</span>
          </li>
          <li>
            <el-button type="default" v-html="user.profile.following" circle plain />
            <span>팔로잉</span>
          </li>
        </ul>
      </header>
      <post-list :data="postList" />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
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

  @Watch('$route.path') onRoutePath () {
    this.fetchUser(this.$route.params.userId)
    this.fetchPost()
  }

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

<style lang="scss" scoped>
@import "../assets/scss/lib";

p {
  margin: 0 0 5px;
  letter-spacing: -0.5px;
  line-height: 1;
}

.user {
  &Profile {
    font-family: enFont();
    display: flex;
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px dotted #ddd;

    &Info {
      margin-top: 10px;
      max-width: 350px;
      &Header {
        padding-bottom: 10px;
      }
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
      transform: translateX(-3px);
      color: #06F;
      padding-bottom: 5px;
    }

    &Bio {
      font-size: 15px;
      font-family: krFont();
      line-height: 1.3;
      color: #333;
      word-break: break-all;
    }

    &Icon {
      display: inline-block;
      width: 20px;
      text-align: center;
      vertical-align: bottom;
      margin-right: 5px
    }

    &Numbers {
      display: flex;
      justify-content: space-between;
      width: 250px;
      margin-left: 100px;
      padding-left: 0;

      li {
        list-style: none;
        text-align: center;
      }

      .el-button.is-circle {
        width: 50px;
        height: 50px;
      }

      span {
        line-height: 1;
        display: block;
        font-size: 13px;
        margin-top: 10px;
      }
    }
  }
}
</style>