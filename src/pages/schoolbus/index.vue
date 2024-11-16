<template>
  <web-view :src="generalInfo.schoolBusUrl" />
</template>

<script setup lang="ts">
import "./index.scss";
import useGeneralInfo from "@/store/system/generalInfo";

const generalInfo = useGeneralInfo();

</script>
