<template>
  <view class="index">
    <view class="header">
      <app-list-item
        class="applist-item"
        v-for="(item, index) in applist"
        :key="index"
        :label="item.title"
        @tap="appTaped(item.route)"
        :icon-url="item.icon"
        :bg="item.backgroundColor"
      ></app-list-item>
    </view>
    <view class="quick-card-view"> </view>
    <nav-bar></nav-bar>
  </view>
</template>

<script lang="ts">
import NavBar from "../../components/navBar/index.vue";
import Card from "../../components/card/index.vue";
import AppListItem from "../../components/appListItem/index.vue";
import fetch from "../../utils/fetch/fetch";
import Taro from "@tarojs/taro";
import "./index.scss";
import { ref, defineComponent } from "vue";
import SystemService from "../../services/systemService";
interface Applist{
  id:Number
  title:String
  icon:String
  route:String
}
export default defineComponent({
  components: { AppListItem, NavBar, Card },
  setup() {
    const msg = ref("Hello world");
    return {
      msg,
    };
  },
  data() {
    return {
      applist:[],
    };
  },
  async mounted() {
    SystemService.getApplist().then((applist) => {
      this.applist = applist;
    });
  },
  methods: {
    appTaped(url) {
      Taro.navigateTo({
        url: url,
      });
    },
  },
});
</script>
