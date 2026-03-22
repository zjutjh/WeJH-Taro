<template>
  <view :class="[styles.container, source.type ? styles.lost : styles.found]">
    <view :class="styles.header">
      <view :class="styles.title">
        {{ source.type ? "失物招领" : "寻物启事" }}
      </view>
      <view v-if="isForYou" :class="styles.joint">
        <image
          src="https://api.cnpatrickstar.com/img/92a63e97-cd3e-411b-b4aa-8e6fad5fbd00.jpg"
          alt="logo_fy"
          :class="styles.logo"
          mode="aspectFit"
        />
        <text>x</text>
        <image
          src="https://api.cnpatrickstar.com/img/15c05a4c-7c2d-4561-9536-80614b7b65b8.jpg"
          alt="logo_jh"
          :class="styles.logo"
          mode="aspectFit"
        />
      </view>
    </view>
    <view v-if="!source.type" :class="styles.body">
      <view :class="styles.content" class="flex-column">
        <text v-show="source.item_name" space="emsp" :class="styles.text">
          物体名称 {{ source.item_name }}
        </text>
        <text v-show="source.lost_or_found_place" space="emsp" :class="styles.text">
          遗失地点 {{ source.lost_or_found_place }}
        </text>
        <text v-show="source.lost_or_found_time" space="emsp" :class="styles.text">
          遗失时间 {{ source.lost_or_found_time }}
        </text>
        <text v-show="source.contact" space="emsp" :class="styles.text">
          联系方式 {{ source.contact }}
        </text>
        <text v-show="source.introduction" space="emsp" :class="styles.text">
          物品介绍 {{ source.introduction }}
        </text>
      </view>
      <view :class="styles['img-list']">
        <view
          :class="[styles['img-container'], imageList.length > 1 ? styles.multiple : undefined]"
        >
          <view
            v-for="item in imageList"
            :key="`${source.id}-${item}`"
            :class="styles['img-wrapper']"
          >
            <image
              :class="styles.image"
              style="width: 100px; height: 100px"
              mode="aspectFill"
              :src="item"
              @load="handleLoadFinish"
              @tap="() => handlePreviewImages(item)"
            />
          </view>
        </view>
      </view>
    </view>
    <view v-else-if="source.type" :class="styles.body">
      <view :class="styles.content" class="flex-column">
        <text v-show="source.item_name" space="emsp" :class="styles.text">
          物体名称 {{ source.item_name }}
        </text>
        <text v-show="source.lost_or_found_place" space="emsp" :class="styles.text">
          拾得地点 {{ source.lost_or_found_place }}
        </text>
        <text v-show="source.lost_or_found_time" space="emsp" :class="styles.text">
          拾得时间 {{ source.lost_or_found_time }}
        </text>
        <text v-show="source.pickup_place" space="emsp" :class="styles.text">
          领取地点 {{ source.pickup_place }}
        </text>
        <text v-show="source.introduction" space="emsp" :class="styles.text">
          物品介绍 {{ source.introduction }}
        </text>
      </view>
      <view :class="styles['img-list']">
        <view
          :class="[styles['img-container'], imageList.length > 1 ? styles.multiple : undefined]"
        >
          <view
            v-for="item in imageList"
            :key="`${source.id}-${item}`"
            :class="styles['img-wrapper']"
          >
            <image
              :class="styles.image"
              style="width: 100px; height: 100px"
              mode="aspectFill"
              :src="item"
              @load="handleLoadFinish"
              @tap="() => handlePreviewImages(item)"
            />
          </view>
        </view>
      </view>
    </view>
    <view :class="styles.footer" class="flex-column">
      <text>业务服务: {{ source.publisher }}</text>
      <text>发布时间: {{ publishTime }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { compact, get, uniq } from "lodash-es";
import { computed, ref } from "vue";

import { LostfoundRecord } from "@/types/Lostfound";

import styles from "./index.module.scss";

interface PreviewCardProps {
  source: LostfoundRecord;
}

const props = defineProps<PreviewCardProps>();
const needFixWidth = ref(false);

const imageList = computed(() =>
  uniq(compact([props.source.img1, props.source.img2, props.source.img3]))
);

const isForYou = computed(() => props.source.publisher.slice(0, 4) === "“For");

const handlePreviewImages = (url: string) => {
  Taro.previewImage({
    current: url,
    urls: imageList.value
  });
};

const handleLoadFinish = (e: unknown) => {
  const height = Number(get(e, ["detail", "height"])) || 0;
  const width = Number(get(e, ["detail", "width"])) || 0;
  needFixWidth.value = height > width;
};

const publishTime = computed(() => dayjs(props.source.publish_time).format("YYYY年MM月DD日"));
</script>
