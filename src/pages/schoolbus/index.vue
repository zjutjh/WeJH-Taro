<template>
  <web-view :src="generalInfo.schoolBusUrl" />
</template>

<script setup lang="ts">
import "./index.scss";
import useGeneralInfoStore from "@/store/system/generalInfo";
import { storeToRefs } from "pinia";

const { info: generalInfo } = storeToRefs(useGeneralInfoStore());

</script>
