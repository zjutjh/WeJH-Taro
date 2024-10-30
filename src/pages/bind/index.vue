<template>
  <theme-config>
    <title-bar title="绑定" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card title="信息绑定">
          <w-list class="bind-list" :class="{ binded: bindState.zf }">
            <w-list-item
              :extra="bindState.zf ? '已绑定' : '未绑定'"
              arrow="down"
              @tap="renderForm('zf')"
            >
              正方教务系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="{ binded: bindState.oauth }">
            <w-list-item
              :extra="bindState.oauth ? '已绑定' : '未绑定'"
              :class="{ binded: bindState.oauth }"
              arrow="down"
              @tap="renderForm('oauth')"
            >
              统一验证系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="[{ binded: bindState.lib }]">
            <w-list-item :extra="bindState.lib ? '已绑定' : '未绑定'" arrow="down">
              图书馆账号(暂不可用)
            </w-list-item>
          </w-list>
          <w-list class="bind-list" :class="[{ binded:bindState.yxy }]">
            <w-list-item
              :extra="bindState.yxy ? '已绑定' : '未绑定'"
              arrow="down"
              @tap="renderForm('yxy')"
            >
              <text> 一卡通账号 </text>
            </w-list-item>
          </w-list>
        </card>
        <card v-if="bindTab === undefined" title="温馨提示">
          输入密码时请注意特殊字符的中英文编码
        </card>
        <z-f v-if="bindTab === 'zf'" />
        <library v-if="bindTab === 'library'" />
        <y-x-y v-if="bindTab === 'yxy'" />
        <oauth v-if="bindTab === 'oauth'" />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar, WList, WListItem } from "@/components";
import Library from "./Library/index.vue";
import ZF from "./ZF/index.vue";
import YXY from "./YXY/index.vue";
import Oauth from "./Oauth/index.vue";
import "./index.scss";
import { onMounted, ref } from "vue";
import { getCurrentInstance } from "@tarojs/taro";
import useUserStore from "@/store/service/user";
import useNewFeatureStore from "@/store/service/newFeature";
import { storeToRefs } from "pinia";

// TODO: 图书馆账号不可用，标题动态化

const bindTab = ref<string | undefined>(undefined);
const { bindState } = storeToRefs(useUserStore());
const newFeatureStore = useNewFeatureStore();

onMounted(() => {
  expandDefault();
  if (newFeatureStore.tree.my !== null && typeof newFeatureStore.tree.my !== "string")
    newFeatureStore.tree.my.bind = null;
});

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
