<template>
  <theme-config>
    <title-bar title="成绩绩点" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="!scoreList || scoreList.length === 0" style="text-align: center">
          <view>无当前阶段成绩信息</view>
        </card>

        <card v-else class="score-card">
          <template #header>
            <view class="row">
              <view class="score-icon-wrapper">
                <view class="score-icon iconfont icon-score" />
              </view>
              <view v-if="selectTerm.year!='全'" class="col">
                <view class="term-info">
                  {{ termInfo }}
                </view>
                <view class="relative-term-info">
                  {{ relativeTermInfo }}
                </view>
              </view>
              <view v-if="selectTerm.year=='全'" class="col">
                <view class="term-info">
                  总计绩点
                </view>
                <view class="relative-term-info">
                  入学以来所有绩点总和
                </view>
              </view>
            </view>

            <view class="col">
              <view class="gpa-text">
                {{ selectTerm.period === "期中" ? "期中" : "GPA" }}
              </view>
              <view v-if="scoreList && scoreList.length !== 0 && selectTerm.period === '期末'" class="credit-text">
                {{ averageScorePoint }}
              </view>
            </view>

            <view
              v-if="!isEdit && selectTerm.period!='期中'"
              class="col button-container"
              style="align-items: flex-end"
              @tap="handleSwitch()"
            >
              <view class="iconfont icon-jisuanqi switch-btn" />
              <view class="button-info">
                计算
              </view>
            </view>

            <view
              v-if="isEdit && selectTerm.period!='期中'"
              class="col button-container"
              style="align-items: flex-end"
              @tap="handleSwitch()"
            >
              <view class="iconfont icon-save-calculation switch-btn" />
              <view class="button-info">
                保存
              </view>
            </view>
          </template>

          <w-collapse v-if="!isEdit" class="score-list-collapse">
            <w-collapse-panel
              v-for="item in selectedLessonsList"
              :key="item.lessonID"
              arrow
              :selected="false"
            >
              <template #header>
                <checkbox-group v-if="isEdit" @change="handleCheckboxChange(item)">
                  <checkbox
                    class="checkbox"
                    :checked="item.selected"
                  />
                </checkbox-group>
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

            <w-collapse-panel
              v-for="item in unSelectedLessonsList"
              :key="item.lessonID"
              arrow
              :selected="true"
            >
              <template #header>
                <checkbox-group v-if="isEdit" @change="handleCheckboxChange(item)">
                  <checkbox
                    class="checkbox"
                    :checked="item.selected"
                  />
                </checkbox-group>
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

          <w-button v-if="isEdit" class="lesson-group-btn" @tap="requireLessonChange()">
            必修课
          </w-button>
          <w-collapse v-if="isEdit" class="score-list-collapse">
            <w-panel v-for="item in requiredScoreList" :key="item.lessonID">
              <template #header>
                <checkbox-group v-if="isEdit" @change="handleCheckboxChange(item)">
                  <checkbox class="checkbox" :checked="item.selected" />
                </checkbox-group>
                <view v-if="item.selected" class="score-list-collapse-item-title-selected" @tap="handleCheckboxChange(item)">
                  {{ item.lessonName }}
                </view>
                <view v-if="item.selected" class="score-list-collapse-item-extra-selected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
                <view v-if="!item.selected" class="score-list-collapse-item-title-unselected" @tap="handleCheckboxChange(item)">
                  {{ item.lessonName }}
                </view>
                <view v-if="!item.selected" class="score-list-collapse-item-extra-unselected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
              </template>
            </w-panel>
          </w-collapse>

          <w-button v-if="isEdit" class="lesson-group-btn" @tap="optionalLessonChange()">
            选修课
          </w-button>
          <w-collapse v-if="isEdit" class="score-list-collapse">
            <w-panel v-for="item in optionalScoreList" :key="item.lessonID">
              <template #header>
                <checkbox-group v-if="isEdit" @change="handleCheckboxChange(item)">
                  <checkbox
                    class="checkbox"
                    :checked="item.selected"
                  />
                </checkbox-group>
                <view
                  v-if="item.selected"
                  class="score-list-collapse-item-title-selected"
                  color=""
                  @tap="handleCheckboxChange(item)"
                >
                  {{ item.lessonName }}
                </view>
                <view v-if="item.selected" class="score-list-collapse-item-extra-selected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
                <view
                  v-if="!item.selected"
                  class="score-list-collapse-item-title-unselected"
                  color=""
                  @tap="handleCheckboxChange(item)"
                >
                  {{ item.lessonName }}
                </view>
                <view v-if="!item.selected" class="score-list-collapse-item-extra-unselected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
              </template>
            </w-panel>
          </w-collapse>

          <w-button v-if="isEdit" class="lesson-group-btn" @tap="sportsLessonChange()">
            体育课
          </w-button>
          <w-collapse v-if="isEdit" class="score-list-collapse">
            <w-panel v-for="item in sportsScoreList" :key="item.lessonID">
              <template #header>
                <checkbox-group v-if="isEdit" @change="handleCheckboxChange(item)">
                  <checkbox
                    class="checkbox"
                    :checked="item.selected"
                  />
                </checkbox-group>
                <view
                  v-if="item.selected"
                  class="score-list-collapse-item-title-selected"
                  color=""
                  @tap="handleCheckboxChange(item)"
                >
                  {{ item.lessonName }}
                </view>
                <view v-if="item.selected" class="score-list-collapse-item-extra-selected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
                <view
                  v-if="!item.selected"
                  class="score-list-collapse-item-title-unselected"
                  color=""
                  @tap="handleCheckboxChange(item)"
                >
                  {{ item.lessonName }}
                </view>
                <view v-if="!item.selected" class="score-list-collapse-item-extra-unselected" @tap="handleCheckboxChange(item)">
                  {{ item.score }}
                </view>
              </template>
            </w-panel>
          </w-collapse>
        </card>
        <card v-if="scoreList?.length !== 0">
          <view v-if="selectTerm.period=='期末'" class="score-help">
            {{ helpText.score }}
          </view>
          <view v-if="selectTerm.period=='期中'" class="score-help">
            {{ helpText.mediascore }}
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view />
      <view class="col">
        <score-term-picker
          class="picker"
          :term="selectTerm.term"
          :year="selectTerm.year"
          :period="selectTerm.period"
          :selectflag="1"
          @changed="termChanged"
        />
      </view>
      <view />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Card,
  BottomPanel,
  TitleBar,
  WPanel,
  WCollapsePanel,
  WCollapse,
  WButton,
  WDescriptions,
  WDescriptionsItem,
  ThemeConfig,
  ScoreTermPicker
} from "@/components";
import { Score } from "@/types/Score";
import { ZFService } from "@/services";
import { helpText } from "@/constants/copywriting";
import store, { systemStore, serviceStore } from "@/store";
import "./index.scss";

const isEdit = ref(false);
const selectTerm = ref({
  year: systemStore.generalInfo.scoreYear,
  term: systemStore.generalInfo.term,
  period: serviceStore.score.scorePeriod
});

const scoreList = computed(() => {
  const data = ZFService.getScoreInfo(selectTerm.value).data;
  data.forEach(item => {
    // existingScore存储不纳入计算的成绩
    const existingScore = serviceStore.score.readScoreMarks.find(
      storeItem => (item.lessonID === storeItem.name &&
      item.scorePoint === storeItem.scorePoint)
    );
    if (!existingScore) item.selected = true;
    else item.selected = false;
  });
  return data;
});

const requiredScoreList = computed(() => {
  return scoreList.value.filter(item => item.lessonType === "必修课" || item.lessonType === "必选课");
});

const sportsScoreList = computed(() => {
  return scoreList.value.filter(item => item.lessonType === "体育课");
});

const optionalScoreList = computed(() => {
  return scoreList.value.filter(item => item.lessonType === "任选课" || item.lessonType === "选修课" || item.lessonType === "限选课");
});

const allChosen_1 = ref(false);
const allChosen_2 = ref(false);
const allChosen_3 = ref(false);

const requireLessonChange = () => {
  if (!allChosen_1.value) {
    requiredScoreList.value.forEach(item => {
      if (!item.selected) {
        selectedLessonsList.value.push(item);
        unSelectedLessonsList.value = unSelectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
      };
      item.selected = true;
      store.commit("delUnCalc", item);
    });
  } else {
    requiredScoreList.value.forEach(item => {
      if (item.selected) {
        selectedLessonsList.value = selectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
        unSelectedLessonsList.value.push(item);
        store.commit("setUnCalc", item);
      }
      item.selected = false;
    });
  }
  allChosen_1.value = !allChosen_1.value;
};

const sportsLessonChange = () => {
  if (!allChosen_2.value) {
    sportsScoreList.value.forEach(item => {
      if (!item.selected) {
        selectedLessonsList.value.push(item);
        unSelectedLessonsList.value = unSelectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
      };
      item.selected = true;
      store.commit("delUnCalc", item);
    });
  } else {
    sportsScoreList.value.forEach(item => {
      if (item.selected) {
        selectedLessonsList.value = selectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
        unSelectedLessonsList.value.push(item);
        store.commit("setUnCalc", item);
      }
      item.selected = false;
    });
  }
  allChosen_2.value = !allChosen_2.value;
};

const optionalLessonChange = () => {
  if (!allChosen_3.value) {
    optionalScoreList.value.forEach(item => {
      if (!item.selected) {
        selectedLessonsList.value.push(item);
        unSelectedLessonsList.value = unSelectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
      };
      item.selected = true;
      store.commit("delUnCalc", item);
    });
  } else {
    optionalScoreList.value.forEach(item => {
      if (item.selected) {
        selectedLessonsList.value = selectedLessonsList.value.filter(
          selected => selected.lessonID !== item.lessonID
        );
        unSelectedLessonsList.value.push(item);
        store.commit("setUnCalc", item);
      }
      item.selected = false;
    });
  }
  allChosen_3.value = !allChosen_3.value;
};

const selectedLessonsList = ref<Score[]>([]);
const unSelectedLessonsList = ref<Score[]>([]);
const unselectedLessons = serviceStore.score.unCalScore;

// 监听 scoreList 的变化，判断成绩列表中的数据是否在 unCalScore 中，如果是则不存入 selectedLessons，如果不是则存入 selectedLessons
watch(scoreList, (newScoreList) => {
  selectedLessonsList.value = []; // 重置selectedLessons
  unSelectedLessonsList.value = [];
  newScoreList.forEach((item) => {
    const isFind = unselectedLessons.find(
      storeItem => item.className === storeItem.name && item.scorePoint === storeItem.scorePoint
    );
    // 如果在 unCalScore 中找到相同的课程，则不将其添加到 selectedLessons

    if (isFind) {
      item.selected = false; // 未选中课程
    } else {
      item.selected = true;
    }
    if (item.selected) {
      selectedLessonsList.value.push(item);
    } else if (!item.selected) {
      unSelectedLessonsList.value.push(item);
    }
  });
}, { immediate: true });

function handleCheckboxChange(item) {
  item.selected = !item.selected;
  if (item.selected) {
    selectedLessonsList.value.push(item);
    unSelectedLessonsList.value = unSelectedLessonsList.value.filter(
      selected => selected.lessonID !== item.lessonID
    );
    store.commit("delUnCalc", item);
  } else {
    // 将这个课程从selectedLessons中删除
    selectedLessonsList.value = selectedLessonsList.value.filter(
      selected => selected.lessonID !== item.lessonID
    );
    unSelectedLessonsList.value.push(item);
    store.commit("setUnCalc", item);
  }
}

const isRefreshing = ref(false);

const averageScorePoint = computed(() => {
  const validCourse = selectedLessonsList.value.filter((item) => {
    if (item.score === "缓考" || item.score === "免修") return false;
    if (item.examType === "重修" || item.examType === "补考") return false;
    return true;
  });
  let totalCredits = 0;
  let totalScorePoint = 0;
  // TODO:foreach排查
  validCourse.forEach((item: Score) => {
    const scorePoint = parseFloat(item.scorePoint);
    const credits = parseFloat(item.credits);
    totalScorePoint += scorePoint * credits;
    totalCredits += credits;
  });
  const ans = Math.floor((totalScorePoint / totalCredits) * 1000) / 1000;
  if (ans !== ans) return "";
  else return ans;
});

const termInfo = computed(() => {
  return `
    ${selectTerm.value?.year}/${parseInt(selectTerm.value?.year) + 1}
    （${selectTerm.value?.term}）
  `;
});

const relativeTermInfo = computed(() => {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  let char = charEnum[0];
  if (serviceStore.user.info?.studentID) {
    // 解决2023 年以后的学生 id 是 302023 开头的问题
    if (serviceStore.user.info.studentID.slice(0, 2) === "30") {
      char = charEnum[
        parseInt(selectTerm.value?.year) -
      parseInt(serviceStore.user.info.studentID.slice(2, 6))
      ];
    } else {
      char = charEnum[
        parseInt(selectTerm.value?.year) -
      parseInt(serviceStore.user.info.studentID.slice(0, 4))
      ];
    }
  }
  return `大${char}${selectTerm.value?.term}学期`;
});

const handleSwitch = () => {
  isEdit.value = !isEdit.value;
};

async function termChanged(e) {
  store.commit("changeScorePeriod", e.period);
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateScoreInfo(e);
  isRefreshing.value = false;
}
</script>
