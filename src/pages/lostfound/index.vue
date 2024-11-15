<template>
  <theme-config>
    <title-bar title="失物寻物" back-button />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="['campus', selectCampus === item ? 'active' : undefined]"
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
          :class="selectMain === item ? 'active': undefined"
          @tap="() => handleSelectMain(item)"
        >
          {{ item }}
        </text>
      </view>
      <view class="scroll-view">
        <text
          v-for="item in kindList"
          :key="item"
          :class="selectKind === item ? 'active': undefined"
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
          v-for="item in recordList"
          :key="item.id"
          :source="item"
        />
        <w-skeleton v-if="loading" :style="{borderRadius: '8Px'}" />
        <card v-else-if="!recordList.length && isEmpty">
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
import { LostfoundRecord } from "@/types/Lostfound";
import { ref } from "vue";
import PreviewCard from "./PreviewCard/index.vue";
import "./index.scss";
import WModal from "../../components/Modal/index.vue";
import { helpText } from "@/constants/copywriting";
import useLostFoundStore from "@/store/service/lostfound";
import { useRequestNext } from "@/hooks";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";

const lostFoundStore = useLostFoundStore();

const currentPage = ref(0);
const maxPage = ref(0);
const recordList = ref<LostfoundRecord[]>([]);
const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectKind = ref("全部");
const selectCampus = ref(lostFoundStore.lastOpenCampus || "屏峰");
const mainList = ref<string[]>(["全部", "失物", "寻物"]);
const selectMain = ref(lostFoundStore.lastOpenMain || "全部");
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

const { data: kindList } = useRequestNext(
  () => LostfoundService
    .getKindList()
    .then(list => ["全部", ...list.map(_ => _.kind_name)]),
  {
    initialData: [],
    onError: (e: any) => {
      if (e instanceof RequestError)
        Taro.showToast({
          title: `获取分类失败\r\n${e.message}`,
          icon: "none"
        });
    }
  }
);

const { loading, run: fetchRecords } = useRequestNext(
  LostfoundService.getRecords, {
    defaultParams: {
      campus: selectCampus.value,
      page_num: currentPage.value + 1,
      page_size: 10,
      lost_or_found: ""
    },
    minLoadingTime: 300,
    initialData: { data: [], total_page_num: 0 },
    onSuccess: (res) => {
      // TODO: 优化逻辑
      recordList.value = recordList.value?.concat(
        res.data
      );
      if (recordList.value.length === 0) isEmpty.value = true;
      maxPage.value = res.total_page_num;
      currentPage.value++;
    },
    onError: (e) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `加载失物寻物信息失败\r\n${e.message}`, icon: "none" });
    }
  }
);

const getRecords = (data: {
  campus?: string;
  kind?: string;
  page_num: number;
  page_size: number;
  lost_or_found?: string;
}) => {
  isEmpty.value = false;
  if (data.kind === "全部")
    fetchRecords({ campus: data.campus, page_num: data.page_num, page_size: data.page_size });
  else
    fetchRecords(data);
};

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  lostFoundStore.setLastOpenCampus(campus);
  resetList();
  getRecords({
    campus: campus,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: selectMain.value
  });
};

// TODO: 抽离逻辑到 hook
const handleSelectMain = (main: string) => {
  if (selectMain.value === main) return;
  selectMain.value = main;
  lostFoundStore.setLastOpenMain(main);
  resetList();
  getRecords({
    campus: selectCampus.value,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: main
  });
};

const handleSelectKind = (kind: string) => {
  if (selectKind.value === kind) return;
  selectKind.value = kind;
  resetList();
  getRecords({
    campus: selectCampus.value,
    kind,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: selectMain.value
  });
};

const resetList = () => {
  currentPage.value = 0;
  recordList.value = [];
};

const handleScrollToBottom = () => {
  if (loading.value || maxPage.value <= currentPage.value) return;
  else getRecords({
    campus: selectCampus.value,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: selectMain.value
  });
};

const setHelp = () => {
  isShowHelp.value = true;
};
</script>
