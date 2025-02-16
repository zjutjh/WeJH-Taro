<template>
  <view :class="styles['suit-selector']">
    <view
      v-for="suit in suitList"
      :key="suit.name"
      :class="[styles.suits, fieldSuit?.name === suit.name ? styles.active : undefined]"
      :style="{
        backgroundImage:
          'url('
          + (suit.img !== ''
            ? suit.img
            : 'https://api.cnpatrickstar.com/img/b57036a9-c17c-41af-9e5d-893af1aa7d9a.jpg')
          + ')'
      }"
      @tap="() => handleSelect(suit)"
    >
      <view :class="styles['suit-name']">
        {{ suit.name }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Suit } from "@/types/Suit";
import styles from "./index.module.scss";

defineProps<{ suitList: Suit[] | undefined }>();

const fieldSuit = defineModel<Suit>();

function handleSelect(value: Suit) {
  fieldSuit.value = value;
}
</script>
