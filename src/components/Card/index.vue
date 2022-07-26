<template>
  <view class="wjh-card" :style="getStyle()">
    <view v-if="title" class="wjh-card-header">
      {{ title }}
    </view>
    <view v-if="$slots.header" class="wjh-card-header">
      <slot name="header"></slot>
    </view>
    <view class="wjh-card-body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="wjh-card-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import './index.scss';
  const colorSetDefault = [
    '#62e4c7',
    '#72d0fe',
    '#22caca',
    '#fdc362',
    '#ffcf4d'
  ];
  const colorSetLight = ['#ffedcd', '#fff6c9'];
  export default defineComponent({
    name: 'Card',
    props: {
      title: String,
      color: Number,
      colormode: String
    },
    computed: {
      randColorStyle() {
        if (this.color === undefined) return undefined;
        let colorSet = colorSetDefault;
        if (this.colormode === 'light') colorSet = colorSetLight;
        const number = this.color % colorSet.length;
        return `background-color: ${colorSet[number]};`;
      }
    },
    methods: {
      getStyle() {
        const styleList = [this.randColorStyle];
        return styleList.join(' ');
      }
    }
  });
</script>
