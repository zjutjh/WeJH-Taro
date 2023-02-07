<script setup lang="ts">
import { Fragment, computed, h, ref } from "vue";
import { helpText } from "@/constants/copywriting";
import { serviceStore } from "@/store";
import LessonsTableQuickView from "../LessonsTableQuickView/index.vue";
import ExamQuickView from "../ExamQuickView/index.vue";
import SchoolCardQuickView from "../SchoolCardQuickView/index.vue";
import ScoreQuickView from "../ScoreQuickView/index.vue";
import LibraryQuickView from "../LibraryQuickView/index.vue";
import WModal from "../Modal/index.vue";
import ElectricityQuickView from "../ElectricityQuickView/index.vue";

const helpContent = ref<string | undefined>(undefined);
const isShowHelp = ref(false);

const cards = () => h(
  Fragment,
  serviceStore.homecard.selected
    .map(item => cardsMap.value[item])
    .filter(item => item !== null)
);

const isBindZf = computed(() => {
  return serviceStore.user.isBindZF;
});
const isBindLibrary = computed(() => {
  return serviceStore.user.isBindLibrary;
});
const isBindYxy = computed(() => {
  return serviceStore.user.isBindYXY;
});

const cardsMap = computed(() => ({
  "lessons-table-quick-view": isBindZf.value? h(
    LessonsTableQuickView, {
      "onShowHelp": () => showHelp("lessons-table")
    }
  ): null,
  "exam-quick-view": isBindZf.value? h(
    ExamQuickView, {
      "onShowHelp": () => showHelp("exam-card")
    }
  ): null,
  "school-card-quick-view": isBindYxy.value? h(
    SchoolCardQuickView, {
      "onShowHelp": () => showHelp("school-card")
    }
  ): null,
  "score-quick-view": isBindZf.value? h(
    ScoreQuickView, {
      "onShowHelp": () => showHelp("score-card")
    }
  ): null,
  "library-quick-view": isBindLibrary.value ? h(
    LibraryQuickView
  ): null,
  "electricity-quick-view": isBindYxy.value ? h(
    ElectricityQuickView
  ): null,
}));

console.log( serviceStore.homecard.selected);

function showHelp(prop: string) {
  isShowHelp.value = true;
  if (prop === "lessons-table") helpContent.value = helpText.lessonsTable;
  else if (prop === "score-card") helpContent.value = helpText.scoreCard;
  else if (prop === "school-card") helpContent.value = helpText.schoolCard;
  else if (prop === "exam-card") helpContent.value = helpText.examCard;
}

</script>

<template>
  <cards />
  <w-modal
    v-model:show="isShowHelp"
    :content="`&emsp;&emsp;${helpContent}`"
  ></w-modal>
</template>
