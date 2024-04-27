<template>
  <theme-config>
    <title-bar title="绑定" back-button />
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card title="信息绑定">
          <w-list class="bind-list" :class="{ binded: user.isBindZF }">
            <w-list-item :extra="user.isBindZF ? '已绑定' : '未绑定'" arrow="down"
              @tap="renderForm('zf')">
              正方教务系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="{ binded: user.isBindOauth }">
            <w-list-item :extra="user.isBindOauth ? '已绑定' : '未绑定'" :class="{ binded: user.isBindOauth }" arrow="down" @tap="renderForm('oauth')">
              统一验证系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="[{ binded: user.isBindLibrary }]" >
            <w-list-item :extra="user.isBindLibrary ? '已绑定' : '未绑定'" arrow="down"
              @tap="renderForm('library')">
              图书馆账号
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="[{ binded: user.isBindYXY }]" >
            <w-list-item :extra="user.isBindYXY ? '已绑定' : '未绑定'" arrow="down"
              @tap="renderForm('yxy')">
              <text> 一卡通账号 </text>
              <w-badge> 测试 </w-badge>
            </w-list-item>
          </w-list>
        </card>
        <card v-if="bindTab === undefined" title="温馨提示">输入密码时请注意特殊字符的中英文编码</card>
        <z-f v-if="bindTab === 'zf'" />
        <library v-if="bindTab === 'library'" />
        <y-x-y v-if="bindTab === 'yxy'" />
        <oauth v-if="bindTab === 'oauth'" />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, WList, WListItem, WBadge, TitleBar, ThemeConfig } from "@/components";
import Library from "./Library/index.vue";
import ZF from "./ZF/index.vue";
import YXY from "./YXY/index.vue";
import Oauth from "./Oauth/index.vue";
import { UserService } from "@/services";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { computed, onMounted, ref } from "vue";
import { getCurrentInstance } from "@tarojs/taro";

const bindTab = ref<string | undefined>(undefined);

const user = computed(() => serviceStore.user);

onMounted(() => {
  getUserBindInfo();
  expandDefault();
  store.commit("updateNotification", { my: { bind: null } });
});

async function getUserBindInfo() {
  store.commit("startLoading");
  await UserService.getUserInfo();
  store.commit("stopLoading");
}

/**
 * 根据路由展开默认的绑定面板
 */
const expandDefault = () => {
  const { router } = getCurrentInstance();
  const defaultBind = router?.params.bind;
  bindTab.value = defaultBind;
};

function renderForm(type: string) {
  bindTab.value = type;
}

</script>
