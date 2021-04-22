<template>
  <view class="applist-item" :style="style">
    <image class="applist-item-icon" :src="iconUrl" />
    <text>{{ label }}</text>
  </view>
</template>
<script>
export default {
  props: {
    label: String,
    iconUrl: String,
    bg: {
      default: "red",
      type: String,
    },
  },
  setup() {},
  computed: {
    style() {
      return {
        backgroundColor: this.bg,
      };
    },
  },
};
</script>
<style lang="css">
.applist-item {
  height: 3rem;
  width: 3rem;
  margin: 0.5rem;
  font-size: 0.5rem;
  border-radius: 0.5rem;
}
.applist-item-icon {
  display: block;
  margin: auto;
  width: 3rem;
  height: 3rem;
}
</style>
