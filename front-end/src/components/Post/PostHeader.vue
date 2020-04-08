<template>
  <header>
    <strong class="title">
      <i class="el-icon-edit" />
      {{ post.title }}
    </strong>
    <div class="bottom">
      <div class="writer">
        <router-link :to="`/user/${post.writer.id}`">
          <figure>
            <img :src="`${post.writer.profile.avatar_url}&s=50`" :alt="post.writer.id">
          </figure>
        </router-link>
        <ul class="writerInfo">
          <li><strong>{{ post.writer.id }}</strong></li>
          <li><em><i class="el-icon-date" /> {{ post.createdAt * 1 | dateformat }}</em></li>
        </ul>
      </div>
      <ul class="bottomButtons">
        <li v-if="isWriter">
          <el-button type="primary" size="small" icon="el-icon-edit-outline" plain circle />
        </li>
        <li v-if="isWriter">
          <el-popconfirm
            @onConfirm="$emit('delete')"
            title="정말로 삭제하시겠습니까?"
            confirm-button-text="확인"
            cancel-button-text="취소">
            <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" plain circle />
          </el-popconfirm>
        </li>
        <li>
          <el-button type="default" size="small" @click="$router.back()" plain circle>
            <fa icon="reply" />
          </el-button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Post } from '@Domain'
import { State } from 'vuex-class'
import { GithubProfile } from '@Domain'

@Component
export default class PostHeader extends Vue {
  @Prop({ type: Object }) post!: Post
  @State(state => state.user.profile) profile!: GithubProfile|null
  get isWriter () {
    return this.profile && this.profile.login === this.post.writer.id
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/lib";

* {
  margin: 0;
  padding: 0;
}

ul, li {
  list-style: none
}

header {
  letter-spacing: -0.5px;
  margin-bottom: 60px;
}

.title {
  font-size: 45px;
  font-weight: 100;
  line-height: 1;
  display: block;
  padding-left: 55px;
  padding-bottom: 15px;
  border-bottom: 1px dotted #ddd;
  margin-bottom: 15px;
  font-weight: 700;

  i {
    display: inline-block;
    margin-left: -55px;
    transform: translateY(2px);
  }
}

.writer {
  display: flex;
  align-items: center;
  font-family: enFont();
  line-height: 1;

  figure {
    @include img-wrap();
    width: 40px;
    height: 40px;
    border-radius: 40px;
    overflow: hidden;
  }

  &Info {

    margin-left: 5px;

    strong {
      font-weight: normal;
      font-size: 15px;
    }

    em {
      font-style: normal;
      font-size: 13px;
      color: #aaa;
    }

  }
}
.bottom{
  display: flex;
  justify-content: space-between;
  align-items: center;

  &Buttons {
    display: flex;

    li {
      margin-left: 5px;
    }
  }
}
</style>