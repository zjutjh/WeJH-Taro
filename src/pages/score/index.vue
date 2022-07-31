<template>
  <view class="background">
    <title-bar title="成绩查询"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card v-if="!scoreList" style="text-align: center">
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
    <bottom-panel>
      <reflesh-button
        @reflesh="reflesh"
        :is-refleshing="isRefleshing"
      ></reflesh-button>
      <term-picker class="picker" @changed="termChanged"></term-picker>
      <reflesh-button
        @reflesh="reflesh"
        :is-refleshing="isRefleshing"
      ></reflesh-button>
    </bottom-panel>
  </view>
</template>

<script lang="ts">
  import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WCollapse, WCollapsePanel } from '@/components/collapse/index';
  import { WDescriptions, WDescriptionsItem } from '@/components/descriptions';
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
      WDescriptionsItem
    },
    setup() {
      const selectTerm = ref({
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      });
      const selectedItem: Ref<null | Score> = ref(null);
      const scoreList = computed(
        () => ZFService.getScoreInfo(selectTerm.value).data
      );
      const isRefleshing = ref(false);

      async function termChanged(e) {
        isRefleshing.value = true;
        console.log(selectTerm);
        selectTerm.value = e;
        await ZFService.updateScoreInfo(e);
        isRefleshing.value = false;
      }
      async function reflesh() {
        isRefleshing.value = true;
        await ZFService.updateScoreInfo(selectTerm.value);
        isRefleshing.value = false;
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) await reflesh();
      });
      return {
        scoreList,
        termChanged,
        reflesh,
        selectTerm,
        isRefleshing,
        selectedItem
      };
    },
    computed: {
      averageScorePoint() {
        const validCourse = this.scoreList.filter(
          (item) => item.lessonType !== '任选课'
        );
        let totalCredits = 0;
        let totalScorePoint = 0;
        validCourse.forEach((item) => {
          let scorePoint = item.scorePoint * 1;
          let credits = item.credits * 1;
          totalScorePoint += scorePoint * credits;
          totalCredits += credits;
        });
        return Math.floor((totalScorePoint / totalCredits) * 1000) / 1000;
      },
      termInfo() {
        return `${this.selectTerm?.year}/${this.selectTerm?.year + 1}（${
          this.selectTerm?.term
        }）`;
      },
      relativeTermInfo() {
        const charEmum = ['一', '二', '三', '四'];
        return `大${this.selectTerm?.term}学期`;
      }
    },
    data() {
      return {
        showPop: false
      };
    },
    methods: {
      pop(item) {
        this.selectedItem = item;
        this.showPop = true;
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
