<script setup lang="ts">
import { Image as TaroImage } from "@tarojs/components";
import { computed, onBeforeUpdate, ref, watch } from "vue";

import { PopView, WBadge, WButton } from "@/components";
import { HomeCardName, homeCards } from "@/constants/homeCards";
import { useTheme } from "@/hooks/index";
import { IconTypeEnum } from "@/hooks/useTheme";
import store, { serviceStore } from "@/store";
import { checkBind } from "@/utils";

import styles from "./index.module.scss";

const { isShowByUrl, getIconUrl } = useTheme();

/** 依赖于绑定状态的卡片名字列表 */
const validList = computed(() => {
  // 先根据绑定状态筛选出名字列表
  const valid = Object.entries(homeCards)
    .filter((item) => checkBind[`${item[1].require}`].value)
    .map((item) => item[0]);

  // 删除缓存中已选，但是未绑定的卡片
  const selectedInStore = [...serviceStore.homecard.selected];
  selectedInStore.forEach((item) => {
    const toDelete = valid.find((validItem) => item === validItem);
    if (toDelete === undefined) {
      store.commit("removeHomeCardItem", item);
    }
  });

  return valid;
});

const selectedList = computed(() => {
  if (serviceStore.homecard.selected.length === 0 && serviceStore.homecard.initialization) {
    store.commit("addHomeCardItem", "lessons-table-quick-view");
    serviceStore.homecard.initialization = false;
  }

  const list = serviceStore.homecard.selected;
  return list.filter((item) => Boolean(homeCards[item])).map((item) => homeCards[item]);
});

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(["update:show"]);

const show = ref(props.show);

onBeforeUpdate(() => {
  show.value = props.show;
});

watch(show, () => {
  emit("update:show", show.value);
});

/** 未选择的卡片名字列表，使用差集运算得到 */
const unselectedList = computed(() => {
  const list = [...validList.value];
  serviceStore.homecard.selected.forEach((name) => {
    const toDelete = list.findIndex((item) => item === name);
    list.splice(toDelete, 1);
  });
  return list.map((item) => homeCards[item]);
});

const handleAddItem = (value: HomeCardName) => {
  store.commit("addHomeCardItem", value);
};

const handleRemoveItem = (value: HomeCardName) => {
  store.commit("removeHomeCardItem", value);
};

const handleClose = () => {
  show.value = false;
};
</script>

<template>
  <pop-view v-model:show="show" style="z-index: 4000">
    <view :class="styles.container">
      <view :class="styles.card">
        <view :class="styles.header">
          <text>已添加功能</text>
        </view>
        <view :class="[styles.content, styles.selected]">
          <view
            v-for="item in selectedList"
            :key="item.name"
            :class="styles.item"
            @tap="handleRemoveItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`--bg-color: var(--wjh-color-${item.backgroundColor}-600)` as any"
            >
              <taro-image
                v-if="isShowByUrl"
                :src="getIconUrl(item.icon, IconTypeEnum.AppList)"
                mode="aspectFit"
              />
              <view v-else :class="['iconfont', `icon-${item.icon}`, styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
            <view :class="styles['badge-wrapper']">
              <w-badge>
                <view style="transform: scale(1.5)"> - </view>
              </w-badge>
            </view>
          </view>
        </view>
      </view>

      <view :class="styles.card">
        <view :class="styles.header">
          <text>未添加功能</text>
        </view>
        <view :class="[styles.content, styles.unselected]">
          <view
            v-for="item in unselectedList"
            :key="item.name"
            :class="styles.item"
            @tap="handleAddItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`--bg-color: var(--wjh-color-${item.backgroundColor}-600)` as any"
            >
              <taro-image
                v-if="isShowByUrl"
                :src="getIconUrl(item.icon, IconTypeEnum.AppList)"
                mode="aspectFit"
              />
              <view v-else :class="['iconfont', `icon-${item.icon}`, styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
            <view :class="styles['badge-wrapper']">
              <w-badge color="var(--wjh-color-primary)">
                <view style="transform: scale(1.5)"> + </view>
              </w-badge>
            </view>
          </view>
        </view>
      </view>

      <view :class="styles.footer">
        <w-button shape="rounded" @tap="handleClose"> 完成 </w-button>
      </view>
    </view>
  </pop-view>
</template>
