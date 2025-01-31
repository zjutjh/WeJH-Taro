<script setup lang="ts">

import { computed, onBeforeUpdate, ref, watch } from "vue";
import styles from "./index.module.scss";
import { HomeCardName } from "@/constants/homeCards";
import { PopView, WBadge, WButton } from "@/components";
import useHomeCardStore from "@/store/service/homecard";
import { storeToRefs } from "pinia";

const homeCardStore = useHomeCardStore();
const { allCards, selectedCards } = storeToRefs(homeCardStore);

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

/** 未选择的卡片名字列表，使用差集运算得到 */
const unselectedCards = computed(() => {
  return allCards.value.filter(item => !selectedCards.value.includes(item));
});

const handleAddItem = (value: HomeCardName) => {
  homeCardStore.add(value);
};

const handleRemoveItem = (value: HomeCardName) => {
  homeCardStore.remove(value);
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
            v-for="item in selectedCards"
            :key="item.name"
            :class="styles.item"
            @tap="handleRemoveItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`--bg-color: var(--wjh-color-${item.backgroundColor}-600)` as any"
            >
              <view :class="['iconfont', `icon-${item.icon}`, styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
            <view :class="styles['badge-wrapper']">
              <w-badge>
                <view style="transform: scale(1.5);">
                  -
                </view>
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
            v-for="item in unselectedCards"
            :key="item.name"
            :class="styles.item"
            @tap="handleAddItem(item.name)"
          >
            <view
              :class="styles[`icon-wrapper`]"
              :style="`--bg-color: var(--wjh-color-${item.backgroundColor}-600)` as any"
            >
              <view :class="['iconfont', `icon-${item.icon}`, styles.icon]" />
            </view>
            <text>{{ item.label }}</text>
            <view :class="styles['badge-wrapper']">
              <w-badge color="var(--wjh-color-primary)">
                <view style="transform: scale(1.5);">
                  +
                </view>
              </w-badge>
            </view>
          </view>
        </view>
      </view>

      <view :class="styles.footer">
        <w-button shape="rounded" @tap="handleClose">
          完成
        </w-button>
      </view>
    </view>
  </pop-view>
</template>
