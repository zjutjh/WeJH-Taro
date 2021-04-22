<template>
  <view>
    <view class="my-header">
      <view class="avatar">
        <open-data type="userAvatarUrl" />
      </view>
      <view>
        <text class="name" v-if="user">
          {{ user.username }}
        </text>
        <open-data v-else class="name" type="userNickName" />
        <text class="sub-line" v-if="user">{{ user.studentID }}</text>
        <text class="sub-line">微精弘—Dev</text>
      </view>
    </view>
    <view>
      <view class="item" v-for="item in items" :key="item.title">
        {{ item.title }}
      </view>
    </view>
    <nav-bar></nav-bar>
  </view>
</template>

<script lang="ts">
import NavBar from "../../components/navBar/index.vue";
import { defineComponent } from "vue";
import "./index.scss";
import UserService from "../../services/userServices";
export default defineComponent({
  components: { NavBar },
  data() {
    return {
      items: [
        {
          icon: "",
          title: "实验室",
        },
        {
          icon: "",
          title: "反馈",
        },
        {
          icon: "",
          title: "关于",
        },
      ],
      user: null,
    };
  },
  mounted() {
    UserService.getUserInfo().then((user) => {
      console.log(user);
      this.user = user;
    });
  },
});
</script>
