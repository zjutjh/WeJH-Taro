<template>
  <view class="quick-view-container" @tap="handleClick">
    <view class="header"><view class="title"> 失物寻物 </view></view>
    <view v-if="randomContent" class="content flex-column">
      <text v-show="!randomContent?.type && randomContent?.item_name" class="text">
        物品名称 {{ randomContent?.item_name }}
      </text>
      <text
        v-show="!randomContent?.type && randomContent?.lost_or_found_place"
        class="text"
        style="margin-top: -10px"
      >
        遗失地点 {{ randomContent?.lost_or_found_place }}
      </text>
      <text
        v-show="!randomContent?.type && randomContent?.lost_or_found_time"
        class="text"
        style="margin-top: -10px"
      >
        遗失时间 {{ randomContent?.lost_or_found_time }}
      </text>
      <text v-show="randomContent?.type && randomContent?.item_name" class="text">
        物品名称 {{ randomContent?.item_name }}
      </text>
      <text
        v-show="randomContent?.type && randomContent?.lost_or_found_place"
        class="text"
        style="margin-top: -10px"
      >
        拾得地点 {{ randomContent?.lost_or_found_place }}
      </text>
      <text
        v-show="randomContent?.type && randomContent?.lost_or_found_time"
        class="text"
        style="margin-top: -10px"
      >
        拾得时间 {{ randomContent?.lost_or_found_time }}
      </text>
    </view>
    <view v-else :class="['content', 'empty']">
      <text class="campus"> {{ lastOpenCampus }} </text>
      <text> 校区暂时没有失物寻物信息 </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { lostfoundServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { useLostfoundStore } from "@/store/service/lostfound";

const { lastOpenCampus } = storeToRefs(useLostfoundStore());

const { data } = useQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_RECORD, lastOpenCampus] as const,
  queryFn: ({ queryKey }) =>
    lostfoundServiceNext.QueryLostRecords(
      {
        campus: queryKey[1],
        pageNum: 1,
        pageSize: 5,
        kind: "",
        lostOrFound: ""
      },
      { snake: true }
    ),
  select: (res) => res.data,
  meta: { persist: false }
});

const handleClick = () => Taro.navigateTo({ url: "/pages/lostfound/index" });

const randomContent = computed(() => {
  const list = data.value;
  const realLength = list?.length;
  return realLength ? list[Math.floor(Math.random() * realLength)] : "";
});
</script>
