<script setup lang="ts">
import { Fragment, VNode, computed, h, ref } from "vue";
import { helpText } from "@/constants/copywriting";
import { serviceStore } from "@/store";
import LessonsTableQuickView from "../LessonsTableQuickView/index.vue";
import ExamQuickView from "../ExamQuickView/index.vue";
import SchoolCardQuickView from "../SchoolCardQuickView/index.vue";
import ScoreQuickView from "../ScoreQuickView/index.vue";
import LibraryQuickView from "../LibraryQuickView/index.vue";
import WModal from "../Modal/index.vue";
import { HomeCardName } from "@/constants/homeCards";

const helpContent = ref<string | undefined>(undefined);
const isShowHelp = ref(false);

const selectedCards = computed(() => {
  return serviceStore.homecard.selected;
});

const cards = () => h(
  Fragment,
  selectedCards.value
    .map(item => cardsMap[item])
    .filter(item => item !== null)
);

const isBindZf = computed(() => {
  return serviceStore.user.isBindZF;
});
const isBindCard = computed(() => {
  return serviceStore.user.isBindCard;
});
const isBindLibrary = computed(() => {
  return serviceStore.user.isBindLibrary;
});

const cardsMap: {
  // eslint-disable-next-line no-unused-vars
  [key in HomeCardName]: VNode | null
} = {
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
  "school-card-quick-view": isBindCard.value? h(
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
};

selectedCards.value.map(item => {
  console.log(cardsMap[item]);
  return cardsMap[item];
});

function showHelp(prop: string) {
  isShowHelp.value = true;
  if (prop === "lessons-table") helpContent.value = helpText.lessonsTable;
  else if (prop === "school-card") helpContent.value = helpText.schoolCard;
  else if (prop === "score-card") helpContent.value = helpText.scoreCard;
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
