<template>
  <view :class="[
    styles.container,
    source.type ? styles.lost : styles.found
  ]">
    <view :class="styles.header">
      <view :class="styles.title">
        {{ source.type ? "失物招领": "寻物启事" }}
      </view>
      <view :class="styles.extra">
        {{ dayjs(source.publish_time).format("YYYY/MM/DD HH:mm") }}
      </view>
    </view>
    <view :class="styles.body">
      <view :class="styles.content">
         {{ source.content }}
      </view>
      <view :class="styles['img-list']">
        <view :class="[
          styles['img-container'],
          imageList.length > 1 ? styles.multiple : undefined
        ]">
          <view
            :key="item"
            v-for="item in imageList"
            :class="styles['img-wrapper']"
          >
            <image
              :class="styles.image"
              :style="needFixWidth ? { width: '100%' } : undefined"
              :mode="imageList.length > 1
                ? 'aspectFill'
                :`${needFixWidth ? 'widthFix' : 'heightFix'}`"
              :src="item"
              @tap="() => handlePreviewImages(item)"
              :onLoad="handleLoadFinish"
            />
          </view>
        </view>
      </view>
    </view>
    <view :class="styles.footer">
      <text>数据来源: {{ source.publisher }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { LostfoundRecord } from "@/types/Lostfound";
import { toRefs, computed, ref } from "vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const props = defineProps<{
  source: LostfoundRecord;
}>();
const needFixWidth = ref(false);

const imageList = computed(() => [
  source.value?.img1 || null,
  source.value?.img2 || null,
  source.value?.img3 || null
].filter(item => !!item) as string[]);

const { source } = toRefs(props);

const handlePreviewImages = (url: string) => {
  Taro.previewImage({
    current: url,
    urls: imageList.value
  });
};

const handleLoadFinish = ({ detail: { height, width }}) => {
  if (height > width) needFixWidth.value = false;
  else needFixWidth.value = true;
  console.log(height, width);
};

</script>
