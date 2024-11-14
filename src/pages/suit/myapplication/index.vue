<template>
  <theme-config>
    <title-bar title="我的申请" :back-button="true" />
    <view :class="styles['campus-selector']">
      <view :class="styles['container']">
        <view
          v-for="item in CampusList"
          :key="item"
          :class="[styles['campus'], queryOptions.campus === item ? styles['active'] : undefined]"
          @tap="() => handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view :class="[styles['kind-selector'],'flex-column']">
      <view :class="styles['scroll-view']">
        <text>
          状态  |
        </text>
        <text
          v-for="item in StatusList"
          :key="item"
          :class="queryOptions.applyStatus === item ? styles['active'] : undefined"
          @tap="() => handleSelectStatus(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>
    <scroll-view
      lower-threshold="100"
      :scroll-y="true"
      :class="styles['list-wrapper']"
    >
      <view :class="styles['record-list']">
        <preview-card
          v-for="record in recordList"
          :key="record.id"
          :source="record"
          @cancel="handleDelete"
        />
        <w-skeleton v-if="loading" :style="{ borderRadius: '8Px' }" />
        <card v-else-if="!recordList.length" :is-empty="true">
          <text>该分类下暂无申请记录</text>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { ThemeConfig, TitleBar, Card, WSkeleton } from "@/components";
import { SuitService } from "@/services";
import PreviewCard from "./PreviewCard/index.vue";
import useSuitQueryOptions from "@/store/service/suit/queryOptions";
import { useRequestNext } from "@/hooks";

const CampusList = ["屏峰", "朝晖", "莫干山"] as const;
const StatusList = ["待处理", "借用中", "已完成"] as const;
const CampusCodeDict = { "朝晖": 1, "屏峰": 2, "莫干山": 3 } as const;
const StatusCodeDict = { "待处理": 1, "借用中": 3, "已完成": 4 } as const;

const queryOptions = useSuitQueryOptions();

const { loading, run: fetchRecords, data: recordList } = useRequestNext(
  (params: { campus: keyof typeof CampusCodeDict, status: keyof typeof StatusCodeDict }) => {
    const { campus, status } = params;
    return SuitService.getRecords({ campus: CampusCodeDict[campus], status: StatusCodeDict[status] });
  }, {
    initialData: [],
    resetOnRun: true,
    defaultParams: {
      campus: queryOptions.campus,
      status: queryOptions.applyStatus
    },
    minLoadingTime: 300,
    onError: (e: Error) => {
      return `加载申请信息失败\r\n${e.message || "网络错误"}`;
    }
  }
);

const handleSelectCampus = (campus: keyof typeof CampusCodeDict) => {
  if (queryOptions.campus === campus) return;
  queryOptions.setOptions({ campus });

  fetchRecords({ campus, status: queryOptions.applyStatus });
};

const handleSelectStatus = (status: keyof typeof StatusCodeDict) => {
  if (queryOptions.applyStatus === status) return;
  queryOptions.setOptions({ applyStatus: status });

  fetchRecords({ campus: queryOptions.campus, status });
};

const handleDelete = () => {
  fetchRecords();
};
</script>
