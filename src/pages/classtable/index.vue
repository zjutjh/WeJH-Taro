<template>
  <view class="index"
    ><classtable></classtable>
    <view class="bottom-panel">
      <button class="button"></button>
      <term-picker class="picker"></term-picker>
      <button class="button"></button>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";
import classtable from "../../components/classtable/index.vue";
import termPicker from "../../components/termPicker/index.vue";
import "./index.scss";
export default {
  components: { classtable, termPicker },
  setup() {
    const msg = ref("Hello world");
    return {
      msg,
    };
  },
};
</script>
<style scoped>
.picker {
  font-size: 0.5rem;
  width: 3rem;
}
.bottom-panel {
  width: 100vw;
  background: salmon;
  position: fixed;
  bottom: 0rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;
  z-index: 2;
}
.button {
  width: 1rem;
}
</style>
