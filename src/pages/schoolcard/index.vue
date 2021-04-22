<template>
  <view class="index">
    {{ balance }}
  </view>
</template>

<script>
import { reactive, ref } from "vue";
import "./index.scss";
import Taro from "@tarojs/taro";
import { defineComponent } from "vue";
import CardService from "../../services/cardService";
export default defineComponent({
  data() {
    return {
      balance: 0,
    };
  },
  setup() {},
  async mounted() {
    this.balance = await CardService.getCardBalance();
  },
});
</script>
<style scoped>
.bus-card {
  background: blanchedalmond;
  padding: 1rem;
  border-radius: 1rem;
  margin: 1rem;
}
.image {
  display: block;
  margin: auto;
}
.line-no {
  font-size: 70%;
}
</style>
