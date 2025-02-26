<template>
  <w-collapse class="score-list-collapse">
    <w-collapse-panel
      v-for="item in (scoreList as Array<FinalTermScore & MidTermScore>)"
      :key="item.lessonID"
      arrow
    >
      <template #header>
        <view class="score-list-collapse-item-title">
          {{ item.lessonName }}
        </view>
        <view class="score-list-collapse-item-extra">
          {{ item.score }}
        </view>
      </template>

      <w-descriptions class="score-detail-list" size="small">
        <w-descriptions-item label="课程名称">
          {{ item.lessonName }}
        </w-descriptions-item>
        <w-descriptions-item v-if="item.lessonType" label="课程性质">
          {{ item.lessonType }}
        </w-descriptions-item>
        <w-descriptions-item label="课程学分">
          {{ item.credits }}
        </w-descriptions-item>
      </w-descriptions>
    </w-collapse-panel>
  </w-collapse>
</template>

<script setup lang="ts">
import {
  WCollapse,
  WCollapsePanel,
  WDescriptions,
  WDescriptionsItem
} from "@/components";
import { FinalTermScore, MidTermScore, ScoreBase } from "@/types/Score";

const props = defineProps<{
  scoreList: ScoreBase[]
}>();

</script>
