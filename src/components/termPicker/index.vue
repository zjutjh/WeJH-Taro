<template>
  <view class="term-selecter">
    <picker mode="multiSelector" :range="selector" @change="onChange">
      <view class="picker">
        {{ selectorChecked[0] }}-{{ selectorChecked[1] }}
      </view>
    </picker>
  </view>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      selector: [
        ["2020", "2019", "2018"],
        ["上", "下", "短"],
      ],
      selectorChecked: ["2021", "上"],
    };
  },
  methods: {
    onChange: function (e) {
      this.selectorChecked = this.selector.map(
        (ex, index) => ex[e.detail.value[index]]
      );
      this.$emit("changed", this.selectorChecked);
    },
  },
});
</script>
<style>
.term-selecter {
  padding: 0.5rem;
  border-radius: 1rem;
  text-align: center;
  background-color: rgba(218, 218, 218, 0.7);
}
</style>
