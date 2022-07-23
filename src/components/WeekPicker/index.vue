<template>
  <button
    v-if="week <= 19 && week > 1"
    class="week-backward circle"
    @tap="backwardWeek"
  >
    <view class="iconfont icon-arrow-left" />
  </button>
  <picker
    mode="multiSelector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
  >
    <button class="week-selector">
      <text v-if="week > 19 || week < 1">放假中</text>
      <view v-else class="picker">{{ currentWeek }}</view>
    </button>
  </picker>
  <button
    v-if="week < 19 && week >= 1"
    class="week-forward circle"
    @tap="forwardWeek"
  >
    <view class="iconfont icon-arrow-right" />
  </button>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  export default defineComponent({
    name: 'WeekPick',
    props: {
      week: {
        default: 1,
        type: Number
      }
    },
    setup(props) {
      const selector = reactive<string[][]>([]);
      let weeks: string[] = [];
      for (let i = 1; i <= 20; i++) weeks.push(`第${i}周`);
      selector.unshift(weeks);
      const selectorValue = reactive([props.week - 1]);
      return {
        selector,
        selectorValue
      };
    },
    data() {
      return {
        currentWeek: '第周'
      };
    },
    mounted() {
      this.currentWeek = this.selector[0][this.selectorValue[0]];
    },
    methods: {
      onChange(e) {
        this.currentWeek = this.selector[0][e.detail.value[0]];
        this.selectorValue[0] = e.detail.value[0];
        this.$emit('changed', {
          week: e.detail.value[0] + 1
        });
      },
      backwardWeek() {
        if (this.selectorValue[0] > 0) {
          this.selectorValue[0] = this.selectorValue[0] - 1;
          this.currentWeek = this.selector[0][this.selectorValue[0]];
          this.$emit('changed', {
            week: this.selectorValue[0] + 1
          });
        }
      },
      forwardWeek() {
        if (this.selectorValue[0] < 19) {
          this.selectorValue[0] = this.selectorValue[0] + 1;
          this.currentWeek = this.selector[0][this.selectorValue[0]];
          this.$emit('changed', {
            week: this.selectorValue[0] + 1
          });
        }
      }
    }
  });
</script>
<style>
  .week-selector {
    border-radius: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>
