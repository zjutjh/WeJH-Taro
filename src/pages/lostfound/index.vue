<template>
  <theme-config>
    <title-bar title="失物寻物" back-button />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="['campus', campus === item ? 'active' : undefined]"
          @tap="() => handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view class="kind-selector flex-column">
      <view class="scroll-view">
        <text
          v-for="item in mainList"
          :key="item"
          :class="lostOrFound === item ? 'active': undefined"
          @tap="() => handleSelectLostOrFound(item)"
        >
          {{ item }}
        </text>
      </view>
      <view class="scroll-view">
        <text
          v-for="item in kindList"
          :key="item"
          :class="kind === item ? 'active': undefined"
          @tap="() => handleSelectKind(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>
    <scroll-view
      lower-threshold="100"
      :scroll-y="true"
      class="list-wrapper"
      @scrolltolower="handleScrollToBottom"
    >
      <view class="record-list">
        <preview-card
          v-for="item in records"
          :key="item.id"
          :source="item"
        />
        <w-skeleton v-if="isFetchingKindList || isFetchingRecords" :style="{borderRadius: '8Px'}" />
        <card v-else-if="!records.length && isEmpty">
          <text>该分类下暂无失物寻物记录</text>
        </card>
      </view>
    </scroll-view>
    <contact-me :data="contactMsg.data" :message="contactMsg.message" @show-help="setHelp" />
    <w-modal
      v-model:show="isShowHelp"
      :content="`&emsp;&emsp;${helpContent}`"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar, Card, ContactMe, WSkeleton } from "@/components";
import { LostfoundService } from "@/services";
import { computed, ref, watchEffect } from "vue";
import PreviewCard from "./PreviewCard/index.vue";
import "./index.scss";
import WModal from "../../components/Modal/index.vue";
import { helpText } from "@/constants/copywriting";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { storeToRefs } from "pinia";
import useLostFoundQueryOption from "@/hooks/useLostFoundQueryOption";
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";

const { campus, lostOrFound, kind } = storeToRefs(useLostFoundQueryOption());

const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const mainList = ref<string[]>(["全部", "失物", "寻物"]);
const isEmpty = ref(false);
const helpContent = ref(helpText.lostfound);
const isShowHelp = ref(false);

const contactMsg = {
  data: [
    { content: "“For You”工程 朝晖校区 QQ: 2716709627" },
    { content: "“For You”工程 屏峰校区 QQ: 3252819828" },
    { content: "“For You”工程 莫干山校区 QQ: 2030219390" },
    {
      content: "学生事务大厅-朝晖: 综合楼一楼河畔旁",
      extra: "学生事务大厅-朝晖\r\n电话: 88320868"
    },
    {
      content: "学生事务大厅-屏峰: 西4和东15楼下",
      extra: "学生事务大厅-屏峰\r\n东15电话: 85290858\r\n西4电话:85290880"
    },
    {
      content: "学生事务大厅-莫干山: 德8德9连廊",
      extra: "学生事务大厅-莫干山\r\n电话: (0571) 8881 3551"
    }
  ],
  message: "点击查看相关业务服务组织的联系方式"
};

const { data: kindList, error: fetchKindListError, isFetching: isFetchingKindList } = useQuery({
  queryKey: ["lostfound/kind-list"],
  queryFn: () => LostfoundService
    .getKindList()
    .then(list => ["全部", ...list.map(_ => _.kind_name)])
});

watchEffect(() => {
  if (fetchKindListError.value instanceof RequestError) {
    Taro.showToast({
      title: `获取分类失败\r\n${fetchKindListError.value.message}`,
      icon: "none"
    });
  }
});

const {
  data: paginatedData,
  error: fetchRecordsError,
  isFetching: isFetchingRecords,
  hasNextPage, fetchNextPage
} = useInfiniteQuery({
  queryKey: ["lostfound", campus, kind, lostOrFound] as const,
  queryFn: ({ queryKey, pageParam }) => LostfoundService.getRecords({
    campus: queryKey[1],
    kind: queryKey[2] === "全部" ? "" : queryKey[2],
    lost_or_found: queryKey[3] === "全部" ? "" : queryKey[3],
    page_num: pageParam,
    page_size: 10
  }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) =>
    lastPage.total_page_num >= pages.length + 1 ? pages.length + 1 : undefined,
  enabled: computed(() => !!kindList.value),
  staleTime: 5 * 1000,
  meta: {
    persist: false
  }
});

watchEffect(() => {
  if (fetchRecordsError.value instanceof RequestError)
    Taro.showToast({ title: `加载失物寻物信息失败\r\n${fetchRecordsError.value.message}`, icon: "none" });
});

const records = computed(() => {
  return paginatedData.value?.pages.map(page => page.data).flat(1) || [];
});

const handleSelectCampus = (newVal: string) => {
  campus.value = newVal as any;
};

const handleSelectLostOrFound = (newVal: string) => {
  lostOrFound.value = newVal as any;
};

const handleSelectKind = (newVal: string) => {
  kind.value = newVal;
};

const handleScrollToBottom = () => {
  if (isFetchingKindList.value || isFetchingRecords.value || !hasNextPage.value) return;
  fetchNextPage();
};

const setHelp = () => {
  isShowHelp.value = true;
};
</script>
