<template>
  <view class="bind-view background">
    <title-bar title="绑定" back-button />
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card title="信息绑定">
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindZF ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindZF }"
              arrow="down"
              @tap="renderForm('zf')"
            >
              正方教务系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindLibrary ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindLibrary }"
              arrow="down"
              @tap="renderForm('library')"
            >
              图书馆账号
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindYXY ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindYXY }"
              arrow="down"
              @tap="renderForm('yxy')"
            >
             一卡通账号
            </w-list-item>
          </w-list>
        </card>
        <z-f  v-if="bindTab === 'zf'" />
        <library v-if="bindTab === 'library'"/>
        <y-x-y v-if="bindTab === 'yxy'" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { Card, WList, WListItem, TitleBar } from "@/components";
import Library from "./Library/index.vue";
import ZF from "./ZF/index.vue";
import YXY from "./YXY/index.vue";
import { UserService } from "@/services";
import store, { serviceStore } from "@/store";
import "./index.scss";
import { computed, onMounted, ref } from "vue";

const bindTab = ref<string | undefined>(undefined);

const user = computed(() => serviceStore.user);

onMounted(() => {
  getUserBindInfo();
});

async function getUserBindInfo() {
  store.commit("startLoading");
  await UserService.getUserInfo();
  store.commit("stopLoading");
}

function renderForm(type: string) {
  bindTab.value = type;
}

</script>
