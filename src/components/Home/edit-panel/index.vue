<script setup lang="ts">

import { computed, onBeforeUpdate, ref, watch } from "vue";
import styles from "./index.module.scss";
import store, { serviceStore } from "@/store";
import { HomeCardName, homeCards } from "@/constants/homeCards";
import { PopView, WButton } from "@/components";

const selectedList = computed(() => {
  const list = serviceStore.homecard.selected;
  return list.map(item => homeCards[item]);
});

const props = defineProps<{
  show: boolean
}>();

const emit = defineEmits(["update:show"]);

const show = ref(props.show);

onBeforeUpdate(() => {
  show.value = props.show;
});

watch(show, () => {
  emit("update:show", show.value);
});

const unselectedList = computed(() => {
  const list = Object.keys(homeCards);
  serviceStore.homecard.selected.forEach((name => {
    const toDelete = list.findIndex(item => item === name);
    list.splice(toDelete, 1);
  }));
  return list.map(item => homeCards[item]);
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
  <pop-view v-model:show="show" style="z-index: 4000;">
    <view :class="styles.container">

      <view :class="styles.card">
        <view :class="styles.header">
          <text>已添加功能</text>
        </view>
        <view :class="[styles.content, styles.selected]">
          <view
            :class="styles.item"
            v-for="item in selectedList"
            @tap="handleRemoveItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`backgroundColor: var(--wjh-color-${item.backgroundColor})`"
            >
              <view :class="[
              `iconfont icon-${item.icon}`,
              styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view :class="styles.card">
        <view :class="styles.header">
          <text>未添加功能</text>
        </view>
        <view :class="[styles.content, styles.unselected]">
          <view
            :class="styles.item"
            v-for="item in unselectedList"
            @tap="handleAddItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`backgroundColor: var(--wjh-color-${item.backgroundColor})`"
            >
              <view :class="[
              `iconfont icon-${item.icon}`,
              styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view :class="styles.footer">
        <w-button shape="rounded" @tap="handleClose">完成</w-button>
      </view>
    </view>
  </pop-view>
</template>
