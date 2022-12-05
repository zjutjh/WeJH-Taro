<template>
  <picker
    mode="multiSelector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
  >
    <w-button>
      {{ selectorChecked[0] }} {{ selectorChecked[1] }}
      {{ selectorChecked[2] }} {{ selectorChecked[3] }}
    </w-button>
  </picker>
</template>

<script lang="ts">
  import { WButton } from '../button';
  import { defineComponent, reactive, ref, onMounted} from 'vue';
  import { campus } from './constants';
  import { systemStore } from '@/store';
import { dayScheduleStartTime } from '@/constants/dayScheduleStartTime';
  export default defineComponent({
    components: {
      WButton
    },
    props: {
      week: {
        default: 1,
        type: Number
      }
    },
    setup(props, { emit }) {
      let selectorData = [
        campus,
        [],
        ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        []
      ];

      for (let i = 1; i <= 20; i++) selectorData[1].push('第' + i + '周');
      for (let i = 1; i <= 12; i++) selectorData[3].push('第' + i + '节');

      const getCurrentSection =  () => {
        const date = new Date();
        const tmp = date.getHours() * 60 + date.getMinutes();
        let currentSection = 12;
        dayScheduleStartTime.find((item, index)=> {
          if (tmp < item.hour * 60 + item.min) {
            currentSection = index + 1;
            return true;
          }
        });
        console.log(tmp);
        return currentSection;
      };

      const selector = reactive(selectorData);
      const selectorChecked = ref([
        campus[0],
        selectorData[1][props.week < 20 ? props.week - 1 : 0],
        selectorData[2][new Date().getDay() - 1],
        `第${getCurrentSection()}节`
      ]);
      const selectorValue = reactive([
        0,
        props.week < 20 && props.week > 0 ? props.week - 1 : 0,
        new Date().getDay() - 1,
        getCurrentSection() - 1
      ]);

      const onChange = (e) => {
        selectorChecked.value = selector.map(
          (item, index) => item[e.detail.value[index]]
        );
        selectorValue.values = e.detail.value;

        emit('changed', {
          year: systemStore.generalInfo.termYear,
          term: systemStore.generalInfo.term,
          campus: campus[e.detail.value[0]],
          week: Math.pow(2, e.detail.value[1]).toString(),
          weekday: (selectorValue.values[2] + 1).toString(),

          // TODO: 时间段
          sections: Math.pow(2, e.detail.value[3]).toString()
        });
      };

      onMounted(() => {
        emit('changed', {
          year: systemStore.generalInfo.termYear,
          term: systemStore.generalInfo.term,
          campus: campus[selectorValue[0]],
          week: Math.pow(2,selectorValue[1]).toString(),
          weekday: (selectorValue[2] + 1).toString(),
          sections: Math.pow(2,getCurrentSection()).toString()
        });
      });

      return {
        selector,
        selectorChecked,
        selectorValue,
        onChange,
      };
    },
  });
</script>
