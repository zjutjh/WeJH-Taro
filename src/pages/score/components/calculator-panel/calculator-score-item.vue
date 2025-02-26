<template>
  <w-collapse-panel
    :key="`${score.lessonID}-${score.submitTime}`"
    arrow
  >
    <template #header>
      <w-checkbox v-model="isChecked" />
      <view class="score-list-collapse-item-title">
        {{ score.lessonName }}
      </view>
      <view class="score-list-collapse-item-extra">
        {{ score.score }}
      </view>
    </template>

    <w-descriptions class="score-detail-list" size="small">
      <w-descriptions-item label="课程名称">
        {{ score.lessonName }}
      </w-descriptions-item>
      <w-descriptions-item v-if="score.lessonType" label="课程性质">
        {{ score.lessonType }}
      </w-descriptions-item>
      <w-descriptions-item label="课程学分">
        {{ score.credits }}
      </w-descriptions-item>
    </w-descriptions>
  </w-collapse-panel>
</template>

<script setup lang="ts">
import {
  WCollapsePanel,
  WCheckbox,
  WDescriptions,
  WDescriptionsItem
} from "@/components";
import { FinalTermScore } from "@/types/Score";
import { ref, watch } from "vue";

const props = defineProps<{
  score: FinalTermScore,
  checked: boolean,
}>();

const isChecked = ref(props.checked);

const emit = defineEmits<{
  select: [score: FinalTermScore],
  unselect: [score: FinalTermScore]
}>();

watch(isChecked, (newValue) => {
  if (newValue) {
    emit("select", props.score);
  } else {
    emit("unselect", props.score);
  }
});

watch(props, (newValue) => {
  isChecked.value = newValue.checked;
});
</script>
