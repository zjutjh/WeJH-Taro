<template>
  <view class="background">
    <title-bar title="成绩查询"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card
          v-if="!scoreList || scoreList.length === 0"
          style="text-align: center"
        >
          <view>无当前学期成绩信息</view>
        </card>

        <card v-else class="score-card">
          <template #header>
            <view class="row">
              <view class="score-icon-wrapper">
                <image
                  src="@/assets/icons/applist/score.svg"
                  class="score-icon"
                ></image>
              </view>
              <view class="col">
                <view class="term-info">{{ termInfo }}</view>
                <view class="relative-term-info">{{ relativeTermInfo }}</view>
              </view>
            </view>

            <view class="col" style="align-items: flex-end">
              <view class="gpa-text">GPA</view>
              <view
                v-if="scoreList && scoreList.length !== 0"
                class="credit-text"
              >
                {{ averageScorePoint }}
              </view>
            </view>
          </template>

          <w-collapse class="score-list-collapse">
            <w-collapse-panel
              v-for="item in scoreList"
              :key="item.lessonID"
              max-height="100px"
              :extra="item.score"
            >
              <template #header>
                <view>{{ item.lessonName }}</view>
              </template>

              <w-descriptions class="score-detail-list" size="small">
                <w-descriptions-item label="课程性质" :label-span="18">
                  {{ item.lessonType }}
                </w-descriptions-item>
                <w-descriptions-item label="课程学分" :label-span="18">
                  {{ item.credits }}
                </w-descriptions-item>
              </w-descriptions>
            </w-collapse-panel>
          </w-collapse>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view class="col">
        <reflesh-button
          @reflesh="reflesh"
          :is-refleshing="isRefleshing"
        ></reflesh-button>
      </view>
      <view class="col">
        <term-picker
          class="picker"
          :term="selectTerm"
          @changed="termChanged"
        ></term-picker>
      </view>
      <view class="col">
        <w-button shape="circle" size="large" class="sort-button">
          <view class="iconfont icon-paixu" @tap="handleSort"></view>
        </w-button>
      </view>
    </bottom-panel>
  </view>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WCollapse, WCollapsePanel } from '@/components/collapse/index';
  import { WDescriptions, WDescriptionsItem } from '@/components/descriptions';
  import { WButton } from '@/components/button';
  import { Score } from '@/types/Score';
  import TermPicker from '@/components/TermPicker/index.vue';
  import { ZFService } from '@/services';
  import './index.scss';

  export default defineComponent({
    components: {
      Card,
      TermPicker,
      BottomPanel,
      RefleshButton,
      TitleBar,
      WCollapse,
      WCollapsePanel,
      WDescriptions,
      WDescriptionsItem,
      WButton
    },
    setup() {
      const showSorted = ref(false);
      const selectTerm = ref({
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      });
      const scoreList = computed(() =>
        showSorted.value
          ? [...ZFService.getScoreInfo(selectTerm.value).data].sort((a, b) => {
              let scoreA = a.scorePoint,
                scoreB = b.scorePoint;
              return parseFloat(scoreB) - parseFloat(scoreA);
            })
          : ZFService.getScoreInfo(selectTerm.value).data
      );
      const isRefleshing = ref(false);

      async function termChanged(e) {
        isRefleshing.value = true;
        selectTerm.value = e;
        await ZFService.updateScoreInfo(e);
        isRefleshing.value = false;
      }
      async function reflesh() {
        if (isRefleshing.value) return;
        isRefleshing.value = true;
        await ZFService.updateScoreInfo(selectTerm.value);
        isRefleshing.value = false;
      }

      function handleSort() {
        showSorted.value = !showSorted.value;
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) await reflesh();
      });
      return {
        scoreList,
        selectTerm,
        isRefleshing,
        handleSort,
        termChanged,
        reflesh
      };
    },
    computed: {
      averageScorePoint() {
        /* const validCourse = this.scoreList.filter(
          (item) => item.lessonType !== '任选课'
        ); */
        const validCourse = this.scoreList;
        let totalCredits = 0;
        let totalScorePoint = 0;
        validCourse.forEach((item: Score) => {
          let scorePoint = parseFloat(item.scorePoint);
          let credits = parseFloat(item.credits);
          totalScorePoint += scorePoint * credits;
          totalCredits += credits;
        });
        return Math.floor((totalScorePoint / totalCredits) * 1000) / 1000;
      },
      termInfo() {
        return `${this.selectTerm?.year}/${this.selectTerm?.year * 1 + 1}（${
          this.selectTerm?.term
        }）`;
      },
      relativeTermInfo() {
        const charEnum = ['一', '二', '三', '四', '五', '六'];
        let char = charEnum[0];
        if (serviceStore.user.info?.studentID) {
          char =
            charEnum[
              parseInt(serviceStore.user.info.studentID.slice(0, 4)) -
                parseInt(this.selectTerm?.year)
            ];
        }
        return `大${char}${this.selectTerm?.term}学期`;
        // FIXME: 只根据学号来推算大几
      }
    }
  });
</script>
<style>
  @keyframes rote {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .reflesh-running {
    animation: rote 1s alternate infinite;
  }
</style>
