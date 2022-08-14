<template>
  <picker
    mode="multiSelector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
    class="picker-wrapper"
  >
    <w-button class="term-selector">
      <view class="picker"
        >{{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}({{
          selectorChecked[1]
        }})</view
      >
    </w-button>
  </picker>
</template>

<script lang="ts">
  import { WButton } from '../button';
  import { defineComponent, reactive, ref } from 'vue';
  import { systemStore } from '@/store';
  export default defineComponent({
    components: {
      WButton
    },
    props: {
      term: Object
    },
    setup(props) {
      let year = parseInt(
        systemStore?.generalInfo?.termYear
          ? systemStore?.generalInfo?.termYear
          : new Date().getFullYear()
      );
      const selector = reactive([['上', '下', '短']]);
      const selectorChecked = ref([props.term?.year, props.term?.term]);
      let years: string[] = [];

      for (let i = 0; i < 4; i++) years.push(`${year - i}/${year - i + 1}`);
      selector.unshift(years);
      const selectorValue = reactive([
        selector[0].indexOf(
          `${selectorChecked.value[0]}/${
            parseInt(selectorChecked.value[0]) + 1
          }`
        ),
        selector[1].indexOf(selectorChecked.value[1])
      ]);
      return {
        selector,
        selectorValue,
        selectorChecked
      };
    },
    methods: {
      onChange(e) {
        this.selectorChecked = this.selector.map(
          (ex, index) => ex[e.detail.value[index]]
        );
        this.selectorChecked[0] = this.selectorChecked[0].split('/')[0];
        this.$emit('changed', {
          year: this.selectorChecked[0],
          term: this.selectorChecked[1]
        });
      }
    }
  });
</script>
<style></style>
