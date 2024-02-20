<template>
  <theme-config>
    <!-- {{ serviceStore.suit.campusSuitInfo.name }} -->
    <view :class="styles['suit-title-bar']">
      <title-bar title="正装借用" back-button />
    </view>
    <view :class="styles['campus-selector']">
      <view :class="styles.container">
        <view
          :key="item"
          v-for="item in campusList"
          :class="[styles.campus, selectCampus === item ? styles.active : undefined]"
          @tap="() => handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view :class="styles['suit-selector']">
      <view
        :key="suit.name"
        v-for="suit in suitsList"
        :class="[styles.suits, rentSuitStyle === suit.name ? styles.active : undefined]"
        :style="{ backgroundImage: 'url(' + (suit.img !== '' ? suit.img : 'https://api.cnpatrickstar.com/img/b57036a9-c17c-41af-9e5d-893af1aa7d9a.jpg') + ')' }"
        @tap="() => {selectSuitStyle(suit)}"
      >
        <view :class="styles['suit-name']">{{ suit.name }}</view>
      </view>
    </view>
    <view v-if="suitsList.length !== 0" :class="styles['suit-panel']">
      <view v-if="rentSuitStyle !== ''" :class="styles.container">
        <view :class="styles.title">尺码</view>
        <view :class="styles['size-scroll']">
          <view
            :key="spec.id"
            v-for="spec in suitSpecsList"
            :class="[styles['size-card'], rentSuitSpec === spec.spec ? styles.active : undefined]"
            @tap="() => selectSuitSize(spec)"
          >{{ spec.spec }}</view>
        </view>
        <view :class="styles.title">剩余数量</view>
        <view :class="styles['remain-suit-num']">
          {{ suitStock === -1 ? "-" : suitStock }}
          <view v-if="suitStock !== undefined && suitStock <= 3 && suitStock !== -1" :class="styles.warning"> <icon type="warn" color="#f0ad3e"/> <view :class="styles.text">余量不足</view></view>
        </view>
        <view :class="styles.title">数量</view>
        <view :class="styles['rent-suit-number']">
          <view :class="styles['number-symbal']" @tap="minusRentSuitNumber">-</view>
          <view :class="styles['number-num']">{{ rentSuitNumber }}</view>
          <view :class="styles['number-symbal']" @tap="addRentSuitNumber">+</view>
        </view>
      </view>
      <view @tap="onConfirm" :class="[styles.confirm, rentSuitStyle === '' ? styles.unactive : undefined]">提交申请</view>
      <w-modal
        v-model:show="isShowConfirm"
        title="提示"
        content="请您再次确认是否提交申请！另外，申请完成后，如果您所申请的正装的尺码目前标注“余量不足”，请您尽早前往学生事务大厅领取。“余量不足”的正装可能会被线下借用的同学优先借完，从而导致在“微精弘线上借用”已经申请过的同学无正装可借，微精弘对此概不负责！"
        :actions="{
                cancel: {
                  label: '取消',
                  callback: onCancel
                },
                confirm: {
                  label: '确定',
                  callback: confirmRentSuit
                }
              }"
      ></w-modal>
    </view>
    <card v-else :class="styles['card-alarm']">该校区不存在可借用正装</card>
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref,computed, onMounted } from "vue";
import { useRequest } from "@/hooks";
import store, { serviceStore } from "@/store";
import { SuitService } from "@/services";
import styles from "./index.module.scss";
import {
  Card,
  TitleBar,
  ThemeConfig,
  WModal
} from "@/components";

type SpecItem = {
  id: number,
  spec: string,
  stock: number
};
type SuitType = {
  name: string;
  img: string;
  specs: SpecItem[];
}

const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectCampus = ref(serviceStore.suit.lastOpenCampus || "朝晖");
const suitSpecsList = ref<SpecItem[]>([]);
const suitStock = ref<number>(-1);
const rentSuitNumber = ref(1);
const rentSuitSpec = ref<string>();
const rentSuitStyle = ref<string>();
const rentSuitId = ref<number>();
const cam = ref(1);
const isShowConfirm = ref(false);

onMounted(() => {
  readSuitInfo();
});

const readSuitInfo = () => {
  switch(serviceStore.suit.lastOpenCampus) {
  case "朝晖": cam.value = 1; break;
  case "屏峰": cam.value = 2; break;
  case "莫干山": cam.value = 3; break;
  }
  const { run: updateCampus } = useRequest(
    SuitService.getSuitInfo, {
      manual: true,
      defaultParams: {
        campus: cam.value
      },
      onSuccess: (res) => {
        if(res.data.code !== 1) throw new Error(res.data.msg);
        store.commit("setCampusSuitInfo", res.data.data);
        if(serviceStore.suit.campusSuitInfo)
          selectSuitStyle(suitsList.value[0]);
      },
      onError: (e: Error) => {
        return `获取正装信息失败\r\n${e.message || "网络错误"}`;
      }
    }
  );
  updateCampus();
};

const suitsList = computed(() => [
  ...(serviceStore.suit.campusSuitInfo || [])
].sort((a, b) => {return a.name.charCodeAt(0) - b.name.charCodeAt(0);}));

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  store.commit("setLastOpenCampus", campus);
  readSuitInfo();
};

const selectSuitStyle = (suit: SuitType) => {
  if(suit.name === rentSuitStyle.value) return;
  rentSuitStyle.value = suit.name;
  suitSpecsList.value = suit.specs;
  rentSuitNumber.value = 1;
  rentSuitSpec.value = "";
  rentSuitId.value = undefined;
  suitStock.value = -1;

  //每次切换正装种类时，自动选择第一个认尺码并显示剩余数量
  selectSuitSize(suitSpecsList.value[0]);
};

const selectSuitSize = (spec: SpecItem) => {
  if(spec.spec === rentSuitSpec.value) return;
  rentSuitSpec.value = spec.spec;
  rentSuitId.value = spec.id;
  suitStock.value = spec.stock;
  rentSuitNumber.value = 1;
};

const addRentSuitNumber = () => {
  if(suitStock.value !== undefined && rentSuitNumber.value < suitStock.value){
    rentSuitNumber.value++;
    return;
  }
};

const minusRentSuitNumber = () => {
  if(rentSuitNumber.value > 1){
    rentSuitNumber.value--;
  }
};

const confirmRentSuit = () => {
  if(rentSuitId.value === undefined ||
    suitStock.value === undefined ||
    rentSuitNumber.value <= 0 ||
    rentSuitNumber.value > suitStock.value){
    Taro.showToast({ title: "请核对正装信息", icon: "none"});
    return;
  }
  const { run } =  useRequest(
    SuitService.pushRentSuitInfo, {
      manual: true,
      defaultParams: {
        supplies_id: rentSuitId.value,
        count: rentSuitNumber.value
      },
      onSuccess: (res) => {
        if(res.data.code !== 1) throw new Error(res.data.msg);
        Taro.showToast({title: "正装借用申请成功", icon:"none"});
      },
      onError: (e: Error) => {
        return `${e.message || "网络错误"}`;
      }
    }
  );
  run();
  isShowConfirm.value = false;
};

const onCancel = () => {
  isShowConfirm.value = false;
};

const onConfirm = () => {
  isShowConfirm.value = true;
};

</script>
