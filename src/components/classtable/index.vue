<template>
  <view class="warp" ref="table">
    <view class="jc-index-panel index-panel">
      <view v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="i">
        <view class="index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="weekday-index-panel index-panel">
      <view v-for="i in [1, 2, 3, 4, 5, 6, 7]" :key="i">
        <view class="index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="table">
      <view
        class="class"
        v-for="cl in classTable"
        :key="cl.cd_id"
        :style="getStyle(cl)"
      >
        <text class="title">{{ cl.classroom }}</text>
        <text class="content">{{ cl.name }}</text></view
      ></view
    >
  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import "./index.scss";
export default defineComponent({
  data() {
    return {
      offsetWidth: 0,
      offsetHeight: 0,
      classTable: [
        {
          cd_id: "19880",
          classroom: "\u5e7fB403",
          jc: "1-2\u8282",
          weekday: 1,
          begin: 1,
          end: 4,
          name: "\u7535\u8def\u4e0e\u7535\u5b50\u6280\u672f\u57fa\u7840",
        },
        {
          cd_id: "19880",
          classroom: "\u5e7fB403",
          weekday: 2,
          jc: "1-2\u8282",
          begin: 3,
          end: 5,
          name: "\u7535\u8def\u4e0e\u7535\u5b50\u6280\u672f\u57fa\u7840",
        },
        {
          cd_id: "19880",
          classroom: "\u5e7fB403",
          weekday: 4,
          jc: "1-2\u8282",
          begin: 1,
          end: 2,
          name: "\u7535\u8def\u4e0e\u7535\u5b50\u6280\u672f\u57fa\u7840",
        },
        {
          cd_id: "19880",
          classroom: "\u5e7fB403",
          weekday: 5,
          jc: "1-2\u8282",
          begin: 3,
          end: 3,
          name: "\u7535\u8def\u4e0e\u7535\u5b50\u6280\u672f\u57fa\u7840",
        },
        {
          cd_id: "19880",
          classroom: "\u5e7fB403",
          weekday: 6,
          jc: "1-2\u8282",
          begin: 10,
          end: 12,
          name: "\u7535\u8def\u4e0e\u7535\u5b50\u6280\u672f\u57fa\u7840",
        },
      ],
    };
  },
  setup() {},
  watch: {
    variable: {
      handler(item1, item2) {},
    },
  },
  mounted() {
    console.log(this.$refs.table);
    this.offsetWidth = this.$refs.table.offsetWidth;
    this.offsetHeight = this.$refs.table.offsetHeight;
  },

  methods: {
    getStyle(theClass) {
      const FontSize = this.offsetWidth
        ? Math.min(
            this.offsetWidth / 5 / 5,
            ((this.offsetHeight / 12) * (theClass.end - theClass.begin + 1)) / 5
          )/1.5 + "px"
        : (theClass.end - theClass.begin + 2) *3.5 + "px";
      const Height = ((theClass.end - theClass.begin + 1) * 100) / 12 + "%";
      const Top = "calc(" + ((theClass.begin - 1) * 100) / 12 + "%)";
      const Left = "calc(" + ((theClass.weekday - 1) * 90) / 5 + "%)";
      return `top: ${Top};
      left: ${Left};
      height: ${Height};
      font-size: ${FontSize};
      `;
    },
  },
});
</script>
<style></style>
