<template>
  <w-button
    class="arrow-button"
    @tap="backwardWeek"
    shape="circle"
    size="large"
    :class="{ disable: week <= 1 }"
  >
    <view class="iconfont icon-arrow-left" />
  </w-button>
  <picker
    mode="selector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
    class="picker-wrapper"
  >
    <w-button class="week-selector">
      <text v-if="week > 18 || week < 1">放假中</text>
      <view v-else class="picker">{{ currentWeek }}</view>
    </w-button>
  </picker>
  <w-button
    shape="circle"
    class="arrow-button"
    @tap="forwardWeek"
    size="large"
    :class="{ disable: week >= 19 }"
  >
    <view class="iconfont icon-arrow-right" />
  </w-button>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { WButton } from '../button';
  import './index.scss';

  export default defineComponent({
    name: 'WeekPick',
    components: {
      WButton
    },
    props: {
      week: {
        default: 1,
        type: Number
      }
    },
    setup(props) {
      let selector: string[] = [];
      for (let i = 1; i <= 20; i++) selector.push(`第 ${i} 周`);
      const selectorValue = ref(props.week - 1 < 0 ? 0 : props.week - 1);
      return {
        selector,
        selectorValue
      };
    },
    data() {
      return {
        currentWeek: ''
      };
    },
    mounted() {
      this.currentWeek = this.selector[this.selectorValue];
    },
    methods: {
      onChange(e) {
        this.currentWeek = this.selector[e.detail.value];
        this.selectorValue = parseInt(e.detail.value);
        this.$emit('update:week', parseInt(e.detail.value) + 1);
      },
      backwardWeek() {
        if (this.selectorValue > 0) {
          this.selectorValue = this.week - 1 - 1;
          if (this.selectorValue < 0) this.selectorValue = 0;
          this.currentWeek = this.selector[this.selectorValue];
          this.$emit('update:week', this.week - 1);
        }
      },
      forwardWeek() {
        if (this.selectorValue < 18) {
          this.selectorValue = this.week + 1 - 1;
          if (this.selectorValue < 0) this.selectorValue = 0;
          this.currentWeek = this.selector[this.selectorValue];
          this.$emit('update:week', this.week + 1);
        }
      }
    }
  });
</script>
