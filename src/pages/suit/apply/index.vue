<template>
  <theme-config>
    <view :class="styles['suit-title-bar']">
      <title-bar title="正装借用" back-button />
    </view>
    <view :class="styles['campus-selector']">
      <view :class="styles.container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="[styles.campus, selectedCampus === item ? styles.active : undefined]"
          @tap="() => handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view :class="styles['suit-selector']">
      <view
        v-for="suit in suitList"
        :key="suit.name"
        :class="[styles.suits, selectedSuit?.name === suit.name ? styles.active : undefined]"
        :style="{ backgroundImage: 'url(' + (suit.img !== '' ? suit.img : 'https://api.cnpatrickstar.com/img/b57036a9-c17c-41af-9e5d-893af1aa7d9a.jpg') + ')' }"
        @tap="() => {handleSelectSuit(suit)}"
      >
        <view :class="styles['suit-name']">
          {{ suit.name }}
        </view>
      </view>
    </view>
    <view
      v-if="suitList.length !== 0 && selectedCampus !== '朝晖'"
      :class="styles['suit-panel']"
    >
      <view v-if="selectedSuit" :class="styles.container">
        <view :class="styles.title">
          尺码
        </view>
        <view :class="styles['size-scroll']">
          <view
            v-for="spec in selectedSuit.specs"
            :key="spec.id"
            :class="[styles['size-card'], selectedSpec === spec ? styles.active : undefined]"
            @tap="() => handleSelectSpec(spec)"
          >
            <text>{{ spec.spec }}</text>
          </view>
        </view>
        <view :class="styles.title">
          剩余数量
        </view>
        <view :class="styles['remain-suit-num']">
          {{ selectedSpec?.stock ?? "-" }}
          <view
            v-if="selectedSpec?.stock !== undefined && selectedSpec?.stock <= 1"
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
        <view :class="styles['rent-suit-number']">
          <view :class="styles['number-symbol']" @tap="minusRentSuitNumber">
            -
          </view>
          <view :class="styles['number-num']">
            {{ selectedAmount }}
          </view>
          <view :class="styles['number-symbol']" @tap="addRentSuitNumber">
            +
          </view>
        </view>
      </view>
      <w-button
        block
        size="large"
        :disable="selectedSpec === undefined || selectedSpec?.stock === 0"
        @tap="onConfirm"
      >
        {{ selectedSpec?.stock !== 0 ? "提交申请" : "库存不足，无法申请" }}
      </w-button>
      <w-modal
        v-model:show="isShowConfirm"
        title="提示"
        :content="`&emsp;&emsp;${warnContent}`"
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
    </view>
    <card v-else-if="selectedCampus === '朝晖'" :class="styles['card-alarmZhaoHui']">
      <view>朝晖校区线上办理暂不可用</view>
      <view>线下办理借用请前往学生事务大厅</view>
      <view :class="styles.footer">
        <text>地址:综合楼一楼河畔旁 | 联系电话:88320868</text>
      </view>
    </card>
    <card v-else :class="styles['card-alarm']">
      该校区不存在可借用正装
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { SuitService } from "@/services";
import { helpText } from "@/constants/copywriting";
import styles from "./index.module.scss";
import {
  Card,
  ThemeConfig,
  TitleBar,
  WButton,
  WModal
} from "@/components";
import useSuitQueryOptions from "@/store/service/suit/queryOptions";
import { useRequestNext } from "@/hooks";
import { storeToRefs } from "pinia";
import { RequestError } from "@/utils";
import { Spec, Suit } from "@/types/Suit";

const campusList = ["屏峰", "朝晖", "莫干山"] as const;
const CampusCodeDict = { "朝晖": 1, "屏峰": 2, "莫干山": 3 } as const;

const { campus: selectedCampus } = storeToRefs(useSuitQueryOptions());

// form data
const selectedSuit = ref<Suit>();
const selectedSpec = ref<Spec>();
const selectedAmount = ref(1);

const isShowConfirm = ref(false);
const warnContent = ref(helpText.suit.warn);

const { data: suitList, run: fetchSuitList } = useRequestNext(
  async (params: { campus: keyof typeof CampusCodeDict }) => {
    Taro.showLoading({ title: "加载中...", mask: true });
    const list = await SuitService.getSuitInfo({ campus: CampusCodeDict[params.campus] });
    list.sort((a, b) => a.name.localeCompare(b.name));
    list.forEach(suit => suit.specs.sort((a, b) => +a.spec - +b.spec));
    Taro.hideLoading();
    return list;
  }, {
    defaultParams: { campus: selectedCampus.value },
    initialData: [],
    onSuccess: (list) => {
      handleSelectSuit(list[0]);
    },
    onError: (e) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `获取正装信息失败\r\n${e.message}`, icon: "none" });
    }
  }
);

const handleSelectCampus = (campus: "屏峰" | "朝晖" | "莫干山") => {
  if (selectedCampus.value === campus) return;
  selectedCampus.value = campus;
  fetchSuitList({ campus });
};

function handleSelectSuit(suit: Suit) {
  if (suit === selectedSuit.value) return;
  selectedSuit.value = suit;

  handleSelectSpec(suit.specs[0]);
};

const handleSelectSpec = (spec: Spec) => {
  if (spec === selectedSpec.value) return;
  selectedSpec.value = spec;

  selectedAmount.value = 1;
};

const addRentSuitNumber = () => {
  if (selectedSpec.value === undefined) return;
  if (selectedAmount.value < selectedSpec.value.stock)
    selectedAmount.value++;
};

const minusRentSuitNumber = () => {
  if (selectedAmount.value > 1) {
    selectedAmount.value--;
  }
};

async function handleSubmit() {
  if (selectedSpec.value === undefined
   || selectedAmount.value <= 0
   || selectedAmount.value > selectedSpec.value.stock
  ) {
    Taro.showToast({ title: "请核对正装信息", icon: "none" });
    return;
  }

  try {
    await SuitService.pushRentSuitInfo({
      supplies_id: selectedSpec.value.id,
      count: selectedAmount.value
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
