<template>
  <theme-config>
    <view :class="styles['suit-title-bar']">
      <title-bar title="正装借用" back-button />
    </view>
    <campus-selector v-model="fieldCampusCode" />
    <template v-if="!isFetching">
      <view
        v-if="suitList?.length && fieldCampusCode !== CampusCodeEnum.ZH"
        :class="styles['suit-panel']"
      >
        <suit-selector v-model="fieldSuit" :suit-list="suitList" />
        <view v-if="fieldSuit" :class="styles.container">
          <view :class="styles.title">
            尺码
          </view>
          <spec-selector v-model="fieldSpec" :spec-list="fieldSuit.specs" />
          <view :class="styles.title">
            剩余数量
          </view>
          <view :class="styles['remain-suit-num']">
            {{ fieldSpec?.stock ?? "-" }}
            <view
              v-if="fieldSpec?.stock !== undefined && fieldSpec?.stock <= 1"
              :class="styles.warning"
            >
              <icon type="warn" color="#f0ad3e" />
              <view :class="styles.text">
                余量不足
              </view>
            </view>
          </view>
          <view :class="styles.title">
            数量
          </view>
          <amount-counter v-model="fieldAmount" :max="fieldSpec?.stock" />
        </view>
        <w-button
          block
          size="large"
          :disable="fieldSpec === undefined || fieldSpec?.stock === 0"
          @tap="onConfirm"
        >
          {{ fieldSpec?.stock !== 0 ? "提交申请" : "库存不足，无法申请" }}
        </w-button>
      </view>
      <card
        v-else-if="fieldCampusCode === CampusCodeEnum.ZH"
        :class="styles['card-alarm-zh']"
      >
        <view>朝晖校区线上办理暂不可用</view>
        <view>线下办理借用请前往学生事务大厅</view>
        <view :class="styles.footer">
          <text>地址:综合楼一楼河畔旁 | 联系电话:88320868</text>
        </view>
      </card>
      <card v-else :class="styles['card-alarm']">
        该校区不存在可借用正装
      </card>
    </template>
    <w-modal
      v-model:show="isShowConfirm"
      title="提示"
      :content="`&emsp;&emsp;${helpText.suit.warn}`"
      :actions="{
        cancel: {
          label: '取消',
          callback: onCancel
        },
        confirm: {
          label: '确定',
          callback: handleSubmit
        }
      }"
    />
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref, watch, watchEffect } from "vue";
import { SuitService } from "@/services";
import { helpText } from "@/constants/copywriting";
import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import useSuitQueryOptions from "@/pages/suit/composables/useSuitQueryOptions";
import { RequestError } from "@/utils";
import { Spec, Suit } from "@/types/Suit";
import SuitSelector from "../components/suit-selector/index.vue";
import CampusSelector from "../components/campus-selector/index.vue";
import SpecSelector from "../components/spec-selector/index.vue";
import AmountCounter from "../components/amount-counter/index.vue";
import { useQuery } from "@tanstack/vue-query";
import { CampusCodeEnum } from "../types";
import styles from "./index.module.scss";

const queryOptions = useSuitQueryOptions();

const fieldCampusCode = ref<CampusCodeEnum>(queryOptions.campus);
const fieldSuit = ref<Suit>();
const fieldSpec = ref<Spec>();
const fieldAmount = ref(1);
const isShowConfirm = ref(false);

const { data: suitList, error, isFetching } = useQuery({
  queryKey: ["suit/info", fieldCampusCode] as const,
  queryFn: ({ queryKey }) => SuitService.getSuitInfo({
    campus: queryKey[1]
  }),
  placeholderData: [],
  select: raw => raw
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(suit => ({
      ...suit,
      specs: suit.specs.sort((a, b) => +a.spec - +b.spec)
    })),
  meta: {
    persist: false
  }
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({
      title: `获取正装信息失败\r\n${error.value.message}`,
      icon: "none"
    });
  }
});

watch(fieldCampusCode, newValue => {
  queryOptions.campus = newValue;
});

watch(suitList, () => {
  fieldSuit.value = suitList.value?.at(0);
});

watch(fieldSuit, () => {
  fieldSpec.value = fieldSuit.value?.specs.at(0);
});

watch(fieldSpec, () => {
  fieldAmount.value = 1;
});

async function handleSubmit() {
  if (fieldSpec.value === undefined
   || fieldAmount.value <= 0
   || fieldAmount.value > fieldSpec.value.stock
  ) {
    Taro.showToast({ title: "请核对正装信息", icon: "none" });
    return;
  }

  try {
    await SuitService.pushRentSuitInfo({
      supplies_id: fieldSpec.value.id,
      count: fieldAmount.value
    });
    Taro.showToast({ title: "正装借用申请成功", icon: "none" });
  } catch (e) {
    if (e instanceof RequestError)
      Taro.showToast({ title: `申请失败: ${e.message}`, icon: "none" });
  }

  isShowConfirm.value = false;
};

const onCancel = () => {
  isShowConfirm.value = false;
};

const onConfirm = () => {
  isShowConfirm.value = true;
};

</script>
