<template>
  <header-tab-view
    title="成绩"
    :img="require('@/assets/photos/exam.svg')"
    :show-tab="false"
  >
    <template v-slot:content>
      <view v-if="!scoreList" style="text-align: center">
        <view> 无当前学期成绩信息</view>
      </view>
      <view
        v-if="scoreList && scoreList.length !== 0"
        style="text-align: center"
      >
        <view>平均学分绩点 {{ averageScorePoint }}</view>
      </view>
      <view
        class="item card"
        v-for="item in scoreList"
        :key="item.lessonID"
        @tap="pop(item)"
      >
        <view class="cicle" v-if="item.lessonName">
          {{ item.lessonName[0] }}
        </view>
        <view class="item-text">
          <view> {{ item.lessonName }}-{{ item.lessonID }}</view>
          <view>
            <text class="iconfont icon-teacher"></text
            >{{ item.teacherName }}</view
          >
          <view> {{ item.submitTime }}</view>
        </view>
        <view class="score"> {{ item.score }}</view>
      </view>
    </template>
  </header-tab-view>
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
  <pop-view v-model:show="showPop">
    <card v-if="selectedItem" class="pop-card">
      <view class="title">{{ selectedItem.lessonName }}</view>
      <view><b>课程类型：</b>{{ selectedItem.lessonType }}</view>
      <view
        ><text class="iconfont icon-laoshi"></text
        >{{ selectedItem.teacherName }}</view
      >
      <view>
        学分：
        <text>{{ selectedItem.credits }}</text>
      </view>

      <view class="score-text">{{ selectedItem.score }}</view>
    </card>
  </pop-view>
</template>

<script lang="ts">
  import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import HeaderTabView from '@/components/HeaderTabView/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import { Score } from '@/types/Score';
  import TermPicker from '@/components/TermPicker/index.vue';
  import { ZFService } from '@/services';
  import './index.scss';

  export default defineComponent({
    components: {
      HeaderTabView,
      PopView,
      Card,
      TermPicker,
      BottomPanel,
      RefleshButton
    },
    setup() {
      let selectTerm = ref({
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
        isRefleshing,
        selectedItem
      };
    },
    computed: {
      averageScorePoint() {
        const vaildCourse = this.scoreList.filter(
          (item) => item.lessonType !== '任选课'
        );
        let totalCredits = 0;
        let totalScorePoint = 0;
        vaildCourse.forEach((item) => {
          let scorePoint = item.scorePoint * 1;
          let credits = item.credits * 1;
          totalScorePoint += scorePoint * credits;
          totalCredits += credits;
        });
        return Math.floor((totalScorePoint / totalCredits) * 100) / 100;
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
