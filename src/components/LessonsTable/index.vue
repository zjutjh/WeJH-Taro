<template>
  <view class="warp">
    <view class="jc-index-panel index-panel" :style="jcStyle">
      <view v-for="i in 12" :key="i">
        <view class="num-index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="weekday-index-panel index-panel">
      <view v-for="i in weekdayEnum" :key="i">
        <view class="num-index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="now-week-index" :style="nowWeekStyle" />
    <view class="table table-box" v-if="lessonsTable">
      <view
        class="class"
        v-for="cl in lessonsTable"
        :key="cl.id + cl.week + cl.weekday"
        :style="getPosition(cl)"
      >
        <view
          class="class-card"
          :style="getDynamicColor(parseInt(cl.classID.slice(0, 7), 16))"
          @tap="classCardClick(cl)"
        >
          <view class="title">{{ splitNameAndRoom(cl.lessonPlace)[0] }}</view>
          <view class="title">{{ splitNameAndRoom(cl.lessonPlace)[1] }}</view>
          <text class="item-content" :style="'-webkit-line-clamp: 2'">{{
            cl.lessonName
          }}</text>
        </view>
      </view>
    </view>
    <view class="now-index" :style="nowStyle" />
  </view>
</template>

<script lang="ts">
  import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
  import { Lesson } from '@/types/Lesson';
  import { defineComponent } from 'vue';
  import './index.scss';
  export default defineComponent({
    props: {
      lessons: Array,
      currentWeek: Number
    },

    data() {
      return {
        Height: Number,
        Width: Number,
        Top: Number,
        showPop: false
      };
    },
    computed: {
      weekdayEnum() {
        return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      },
      lessonsTable(): Lesson[] {
        return this.MarkConflictLesson(this.lessons);
      },
      jcStyle() {
        return `height: ${this.Height}px; top: ${this.Top}px;`;
      },
      nowWeekStyle() {
        const now = new Date();
        const weekday = now.getDay();
        const left = 'calc(' + ((weekday - 1) * 126) / 7 + '% + 2rem)';
        return `left: ${left};`;
      },
      nowStyle() {
        const now = new Date();
        const hour = now.getHours();
        const min = now.getMinutes();
        const rate = ((hour - 8) * 60 + min) / ((21 - 8) * 60 + 5);
        return `top: calc(${(rate > 0 ? rate : 0) * this.Height}px + 2rem);`;
      }
    },
    mounted() {
      eventCenter.on(getCurrentInstance()?.router?.onReady || 'onReady', () => {
        console.log('onReady');
        const query = Taro.createSelectorQuery();
        query.select('.table-box').boundingClientRect();
        query.exec((res) => {
          if (typeof res[0].height === 'number')
            this.Height = Number(res[0].height);
          if (typeof res[0].top === 'number') this.Top = Number(res[0].top);
        });
      });
    },
    methods: {
      MarkConflictLesson(lessons: Lesson[]) {
        if (lessons)
          for (let i = 0; i < lessons.length; i++) {
            for (let j = i + 1; j < lessons.length; j++) {
              const item = lessons[i],
                item2 = lessons[j];
              if (item.weekday !== item2.weekday) continue;
              const from1 = parseInt(item.sections.split('-')[0]);
              const to1 = parseInt(item.sections.split('-')[1]);
              const from2 = parseInt(item2.sections.split('-')[0]);
              const to2 = parseInt(item2.sections.split('-')[1]);

              if (!(to1 < from2 || to2 < from1)) {
                lessons[i]['mark'] = true;
                lessons[j]['mark'] = true;
              }
            }
          }
        return lessons;
      },
      splitNameAndRoom(str: string) {
        let index = 0;
        for (; index < str.length; index++) {
          if (str.charCodeAt(index) <= 255) break;
        }
        return [str.slice(0, index), str.slice(index)];
      },
      classCardClick(theClass: Lesson) {
        this.$emit('classClick', theClass);
      },
      getDynamicColor(index = 1) {
        const colorSet = ['green', 'cyan', 'blue', 'yellow', 'orange'];
        return {
          backgroundColor: `var(--wjh-color-${
            colorSet[index % colorSet.length]
          })`
        };
      },
      getPosition(theClass) {
        const begin = parseInt(theClass.sections.split('-')[0]);
        const end = parseInt(theClass.sections.split('-')[1]);
        const weekday = parseInt(theClass.weekday);
        const fontSize = Math.min(12, (end - begin + 2) * 4) + 'px';
        const height = ((end - begin + 1) * 100) / 12 + '%';
        const top = 'calc(' + ((begin - 1) * 100) / 12 + '%)';
        const left = 'calc(' + ((weekday - 1) * 90) / 5 + '%)';
        return { top, left, height, fontSize };
      }
    }
  });
</script>
