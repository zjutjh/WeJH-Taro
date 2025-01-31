<script setup lang="ts">
import { Fragment, VNode, computed, h, ref } from "vue";
import { helpText } from "@/constants/copywriting";
import LessonsTableQuickView from "../LessonsTableQuickView/index.vue";
import ExamQuickView from "../ExamQuickView/index.vue";
import SchoolCardQuickView from "../SchoolCardQuickView/index.vue";
import ScoreQuickView from "../ScoreQuickView/index.vue";
import LibraryQuickView from "../LibraryQuickView/index.vue";
import WModal from "../Modal/index.vue";
import ElectricityQuickView from "../ElectricityQuickView/index.vue";
import useHomeCardStore from "@/store/service/homecard";
import useBinding from "@/hooks/useBinding";
import { HomeCardName, homeCardNameMap } from "@/constants/homeCards";

const helpContent = ref<string | undefined>(undefined);
const isShowHelp = ref(false);
const homeCardStore = useHomeCardStore();
const { canAccess } = useBinding();

const cards = () => h(
  Fragment,
  homeCardStore.selectedCards
    .map(item => cardNameComponentMap.value[item.name])
    .filter(item => item !== null)
);

const cardNameComponentMap = computed(() => {
  const map: Record<HomeCardName, any> = {
    "lessons-table-quick-view": LessonsTableQuickView,
    "exam-quick-view": ExamQuickView,
    "school-card-quick-view": SchoolCardQuickView,
    "score-quick-view": ScoreQuickView,
    "library-quick-view": LibraryQuickView,
    "electricity-quick-view": ElectricityQuickView
  };

  return Object.keys(map).reduce((prev, curr: HomeCardName) => {
    prev[curr] = canAccess(homeCardNameMap[curr].require)
      ? h(map[curr], { "onShowHelp": () => showHelp(curr) })
      : null;
    return prev;
  }, {} as Record<HomeCardName, VNode | null>);
});

function showHelp(prop: HomeCardName) {
  isShowHelp.value = true;
  if (prop === "lessons-table-quick-view") helpContent.value = helpText.lessonsTable;
  else if (prop === "score-quick-view") helpContent.value = helpText.scoreCard;
  else if (prop === "school-card-quick-view") helpContent.value = helpText.schoolCard;
  else if (prop === "exam-quick-view") helpContent.value = helpText.examCard;
}

</script>

<template>
  <cards />
  <w-modal
    v-model:show="isShowHelp"
    :content="`&emsp;&emsp;${helpContent}`"
  />
</template>
