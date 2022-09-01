<template>
  <quick-view
    @tap="nav2Lesson"
    title="课程表"
    icon-name="lessonstable"
    class="lessons-table-quick-view"
    help
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">今日课表 ({{ balanceUpdateTimeString }})</text>
    <card
      v-for="(item, index) in todayLessonTable"
      :key="item.lessonName"
      :style="
        index % 2
          ? 'background-color: var(--wjh-color-yellow-light)'
          : 'background-color: var(--wjh-color-orange-light)'
      "
    >
      <view class="lesson-item">
        <view class="important-line">
          <text class="lesson-place">{{ item.lessonPlace }}</text>
          <text
            v-if="lessonState(item.sections) === 'before'"
            class="before-lesson"
          >
            还有 {{ getTimeString(item.detTime) }} 上课
          </text>
          <text
            v-if="lessonState(item.sections) === 'taking'"
            class="taking-lesson"
          >
            上课中
          </text>
        </view>
        <text class="teacher">
          <text class="iconfont icon-teacher"></text>
          <text class="teacher-name">
            {{ ` ${item.teacherName}` }}
          </text>
          <text class="duration">
            ({{ sectionsTimeString(item.sections) }})
          </text>
        </text>
        <text class="lesson-name">{{ item.lessonName }}</text>
      </view>
    </card>
    <view class="empty" v-if="todayLessonTable?.length === 0">
      今天居然没有课😄
    </view>
    <view class="empty" v-if="!todayLessonTable"> 点击获取你的课表 ～</view>
  </quick-view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import QuickView from '@/components/QuickView/index.vue';
  import Taro from '@tarojs/taro';
  import { ZFService } from '@/services';
  import dayjs from 'dayjs';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import './index.scss';
  import { Lesson } from '@/types/Lesson';
  import { dayScheduleStartTime } from '@/constants/dayScheduleStartTime';
  import { useTimeInstance } from '@/utils/hooks';
  let timer: NodeJS.Timeout | undefined = undefined;

  export default defineComponent({
    components: { QuickView, Card },

    props: {
      hide: Boolean
    },
    computed: {
      todayLessonTable() {
        return this.getTodayLessonTable();
      },
      balanceUpdateTimeString() {
        return dayjs(this.updateTime.balance).fromNow();
      },
      updateTime() {
        return serviceStore.card.updateTime;
      }
    },
    watch: {
      hide: {
        immediate: true,
        handler(val) {
          if (val == true) {
            if (timer) clearInterval(timer);
          } else {
            if (!serviceStore.zf.lessonsTableInfo)
              ZFService.updateLessonTable();
            this.getTodayLessonTable();
            timer = setInterval(this.getTodayLessonTable, 30000);
            // 30 秒刷新一次
          }
        }
      }
    },
    methods: {
      nav2Lesson() {
        Taro.navigateTo({ url: '/pages/lessonstable/index' });
      },
      sectionsTimeString(sections: string) {
        let arr = sections.split('-');
        return `${this.getLessonTimeInstance(arr[0]).format(
          'HH:mm'
        )}-${this.getLessonTimeInstance(arr[1]).format('HH:mm')}`;
      },
      getLessonTimeInstance(jc: number, offset: number = 0) {
        return useTimeInstance(
          dayScheduleStartTime[jc - 1].hour,
          dayScheduleStartTime[jc - 1].min + offset
        );
      },
      goLessonAlert(sections: string) {
        let arr = sections.split('-');
        let detAfter =
          this.getLessonTimeInstance(arr[0]).valueOf() - dayjs().valueOf();
        if (detAfter > 0) return dayjs(detAfter).utc().format('HH:mm');
        else return null;
      },
      goLessonAlertEm(sections: string) {
        // comment: detMin 暂时用不到，后期改动距离上课时间显示规则再重用
        let arr = sections.split('-');
        let detMin = this.getLessonTimeInstance(arr[0]).diff(
          dayjs(),
          'minute',
          true
        );
        return detMin;
      },
      getTodayLessonTable(): Lesson[] | undefined {
        let table = ZFService.getTodayLessonTable();
        table?.forEach((item) => {
          item['detMin'] = this.goLessonAlertEm(item.sections);
          item['detTime'] = this.goLessonAlert(item.sections);
        });
        return table;
      },
      getTimeString(time: string) {
        const hour = parseInt(time.split(':')[0]);
        const min = parseInt(time.split(':')[1]);
        return `${hour ? hour + '小时' : ''}${min ? min + '分钟' : ''}`;
      },
      lessonState(sections: string): 'before' | 'taking' | 'after' {
        let arr = sections.split('-');
        let detAfter =
          this.getLessonTimeInstance(arr[0]).valueOf() - dayjs().valueOf();
        let detBefore =
          this.getLessonTimeInstance(arr[1], 45).valueOf() - dayjs().valueOf();

        if (detAfter > 0) return 'before';
        if (detAfter < 0 && detBefore > 0) return 'taking';
        return 'after';
      },
      handleTapHelp() {
        this.$emit('showHelp', 'lessons-table');
      }
    }
  });
</script>
