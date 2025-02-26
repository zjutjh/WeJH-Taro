<template>
  <checkbox-group
    @tap="(e) => {
      // stopPropagation 内部是设置了 this._stop = true
      // 这个函数调用直接写在模板里面是为了 this 的指向正确
      e.stopPropagation();
    }"
    @change="handleCheck"
  >
    <checkbox :checked="field" class="wjh-checkbox" />
  </checkbox-group>
</template>

<script setup lang="ts">
import { Checkbox, CheckboxGroup } from "@tarojs/components";
import "./index.scss";

const field = defineModel<boolean>({
  default: false
});

function handleCheck() {
  field.value = !field.value;
}
</script>
