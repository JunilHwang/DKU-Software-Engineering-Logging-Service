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
            <el-button type="default" v-html="posts.length" circle plain />
            <span>게시물</span>
          </li>
          <li>
            <el-button @click="windowOpen(`${user.profile.html_url}?tab=followers`)" type="default" v-html="user.profile.followers" circle plain />
            <span>팔로워</span>
          </li>
          <li>
            <el-button @click="windowOpen(`${user.profile.html_url}?tab=following`)" type="default" v-html="user.profile.following" circle plain />
            <span>팔로잉</span>
          </li>
        </ul>
      </header>
      <post-list :data="posts" />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { PostList } from '@/components'
import { namespace } from 'vuex-class'
import { Post, User as UserType } from 'domain/src'
import { ActionMethod } from 'vuex'
import { eventBus } from '@/helper'

const components = { PostList }
const userStore = namespace('user')

@Component({ components })
export default class User extends Vue {

  @userStore.State private posts!: Post[]
  @userStore.State private user!: UserType|null
  @userStore.Action private FETCH_USER_POST!: ActionMethod
  @userStore.Action private FETCH_USER!: ActionMethod

  @Watch('$route.path') async onRoutePath () {
    await this.FETCH_USER(this.$route.params.userId)
    this.fetchPost()
  }

  async fetchPost () {
    await this.FETCH_USER_POST(this.$route.params.userId)
  }

  windowOpen (url: string) {
    window.open(url)
  }

  created () {
    this.FETCH_USER(this.$route.params.userId)
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