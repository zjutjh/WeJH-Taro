<template>
  <view class="background"></view>
  <title-bar title="关于微精弘2.0"></title-bar>
  <scroll-view :scrollY="true">
    <view class="card-view">
      <card>
        <image
          mode="aspectFit"
          :src="require('@/assets/jh-logo.png')"
          style="height: 20vh; width: 70%; display: block; margin: auto"
        ></image>
      </card>
      <card>
        <view>
          <text
            ><b>*</b
            >微精弘是是碎片化、一站式、一体化校园移动门户，适用于浙江工业大学学生，集课表、成绩、考试、空教室、一卡通、借阅等功能于一身。 </text
          ><br />
          <text
            ><b>*</b
            >微精弘有更好用的课表查询，本周视图、学期视图、对应日期及时钟轴，清晰明了。</text
          ><br />
          <text
            ><b>*</b
            >微精弘有更方便的考试安排，帮你折算出考试周对应的日期，以及考试时间倒计时，一目了然。</text
          ><br />
          <text
            ><b>*</b
            >微精弘还是校园生活助手与管家，一卡通余额及消费一览无余，让同学们更合理安排生活费。微精弘更是/更有...
            （期待您的发现）</text
          >
        </view>
      </card>
      <card>
        <view class="info-p">
          <view> Hash：{{ commitHash }} </view>
          <view>
            版本：<nut-tag round type="primary">{{ commitTag }}</nut-tag>
          </view>
          <view> 编译时间：{{ buildTime }} </view>
          <view>精弘网络@{{ currentYear }}</view>
        </view>
      </card>
    </view>
  </scroll-view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import { Tag as NutTag } from '@nutui/nutui-taro';
  import TitleBar from '@/components/TitleBar/index.vue';
  import './index.scss';

  export default {
    components: {
      TitleBar,
      Card,
      NutTag
    },
    computed: {
      commitHash() {
        return process.env.COMMIT_HASH;
      },
      commitTag() {
        return process.env.TAG;
      },
      buildTime() {
        return process.env.BUILD_TIME;
      },
      currentYear() {
        return new Date().getFullYear();
      }
    }
  };
</script>
