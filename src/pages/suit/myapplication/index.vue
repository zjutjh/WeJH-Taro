<template>
  <theme-config>
    <title-bar title="我的申请" :back-button="true" />
    <campus-selector v-model="fieldCampusCode" />
    <rent-status-selector v-model="fieldStatus" />
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
          @cancel="handleCancelApply"
        />
        <card v-if="!isFetching && !recordList?.length">
          <text>该分类下暂无申请记录</text>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar, Card } from "@/components";
import { SuitService } from "@/services";
import PreviewCard from "../components/apply-card/index.vue";
import useSuitQueryOptions from "@/pages/suit/composables/useSuitQueryOptions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, watchEffect } from "vue";
import Taro from "@tarojs/taro";
import CampusSelector from "../components/campus-selector/index.vue";
import RentStatusSelector from "../components/rent-status-selector/index.vue";
import styles from "./index.module.scss";

const queryOptions = useSuitQueryOptions();
const fieldCampusCode = ref(queryOptions.campus);
const fieldStatus = ref(queryOptions.applyStatus);
const queryClient = useQueryClient();

const { data: recordList, isFetching, error } = useQuery({
  queryKey: ["suit/applyRecord", fieldCampusCode, fieldStatus] as const,
  queryFn: ({ queryKey }) => SuitService.getRecords({
    campus: queryKey[1],
    status: queryKey[2]
  }),
  meta: {
    persist: false
  }
});

const { mutate: cancelApply, isPending } = useMutation({
  mutationFn: SuitService.deleteRecords,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["suit/applyRecord", fieldCampusCode, fieldStatus]
    });
  },
  onError: e => {
    if (e instanceof Error) {
      Taro.showToast({ title: `取消申请失败: ${e.message}`, icon: "none" });
    }
  }
});

async function handleCancelApply(id: number) {
  const { cancel } = await Taro.showModal({
    title: "提示",
    content: "确认是否取消申请",
    confirmText: "确认",
    cancelColor: "返回"
  });
  if (!cancel) {
    cancelApply({ borrow_id: id });
  }
}

watchEffect(() => {
  queryOptions.setOptions({
    campus: fieldCampusCode.value,
    applyStatus: fieldStatus.value
  });
});

watchEffect(() => {
  if (isPending.value) {
    Taro.showLoading({ title: "取消申请中", mask: true });
  } else {
    Taro.hideLoading();
  }
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({
      title: `加载申请信息失败\r\n${error.value.message || "网络错误"}`,
      icon: "none"
    });
  }
});
</script>
