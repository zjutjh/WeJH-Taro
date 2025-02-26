<template>
  <template v-for="lessonType in lessonTypeList" :key="lessonType">
    <view @tap="() => handleToggleGroup(lessonType)">
      <text>{{ lessonType }}</text>
    </view>
    <w-collapse class="score-list-collapse">
      <calculator-score-item
        v-for="score in lessonTypeMap.get(lessonType)"
        :key="score.key"
        :score="score"
        :checked="!unselectedKeys.includes(score.key)"
        @select="handleSelect"
        @unselect="handleUnselect"
      />
    </w-collapse>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { WCollapse } from "@/components";
import { FinalTermScore } from "@/types/Score";
import CalculatorScoreItem from "./calculator-score-item.vue";
import useUnselectedScore from "../../composables/use-unselected-score";

const props = defineProps<{
  scoreList: FinalTermScore[],
}>();

const { unselectedKeys, selectScore, unselectScore } = useUnselectedScore();

const lessonTypeMap = computed(() => {
  const map = new Map<string, FinalTermScore[]>();

  props.scoreList.forEach(score => {
    const list = map.get(score.lessonType) || [];
    list.push(score);
    map.set(score.lessonType, list);
  });

  return map;
});

const lessonTypeList = computed(() => {
  return Array.from(lessonTypeMap.value.keys());
});

function handleSelect(score: FinalTermScore) {
  selectScore(score.key);
}

function handleUnselect(score: FinalTermScore) {
  unselectScore(score.key);
}

function handleToggleGroup(lessonType: string) {
  const lessons = lessonTypeMap.value.get(lessonType) || [];

  // 课程类型下，是否所有课都没被选中
  const isAllUnselected = lessons.every(lesson => {
    return unselectedKeys.includes(lesson.key);
  });

  if (isAllUnselected) {
    lessons.forEach(lesson => selectScore(lesson.key));
  } else {
    lessons.forEach(lesson => unselectScore(lesson.key));
  }
}
</script>
