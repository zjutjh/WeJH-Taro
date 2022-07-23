<template>
  <view class="room-selecter">
    <picker
      mode="multiSelector"
      :range="selector"
      @change="onChange"
      :value="selectorValue"
    >
      <view class="picker">
        {{ selectorChecked[0] }} {{ selectorChecked[1] }}
        {{ selectorChecked[2] }} {{ selectorChecked[3] }}
      </view>
    </picker>
  </view>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { campus } from './constants';
  import { systemStore } from '@/store';
  export default defineComponent({
    props: {
      week: {
        default: 1,
        type: Number
      }
    },
    setup(props) {
      let selectorData = [
        campus,
        [],
        ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        []
      ];

      for (let i = 1; i <= 20; i++) selectorData[1].push('第' + i + '周');

      for (let i = 1; i <= 12; i++) selectorData[3].push('第' + i + '节');
      const selector = reactive(selectorData);
      const selectorChecked = ref([
        campus[0],
        selectorData[1][props.week < 20 ? props.week - 1 : 0],
        selectorData[2][new Date().getDay() - 1],
        '第一节'
      ]);
      const selectorValue = reactive([
        0,
        props.week < 20 ? props.week - 1 : 0,
        new Date().getDay() - 1,
        0
      ]);
      return {
        selector,
        selectorChecked,
        selectorValue
      };
    },
    mounted() {
      this.$emit('changed', {
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term,
        campus: campus[this.selectorValue[0]],
        week: Math.pow(2, this.selectorValue[1]).toString(),
        weekday: Math.pow(2, this.selectorValue[2]).toString(),
        sections: Math.pow(2, this.selectorValue[3]).toString()
      });
    },
    methods: {
      onChange: function (e) {
        this.selectorChecked = this.selector.map(
          (ex, index) => ex[e.detail.value[index]]
        );
        this.$emit('changed', {
          year: systemStore.generalInfo.termYear,
          term: systemStore.generalInfo.term,
          campus: campus[e.detail.value[0]],
          week: Math.pow(2, e.detail.value[1]).toString(),
          weekday: Math.pow(2, e.detail.value[2]).toString(),
          sections: Math.pow(2, e.detail.value[3]).toString()
        });
      }
    }
  });
</script>
<style>
  .room-selecter {
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 0.5rem;
    text-align: center;
    background-color: rgba(218, 218, 218, 0.7);
  }
</style>
