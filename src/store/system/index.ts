import { defineStore } from "pinia";
import { ref } from "vue";
import { persistedStateStorage } from "../../utils/storage";

export interface SystemStoreType {
  loading: boolean;
  generalInfo: {
    is_begin: boolean;
    schoolBusUrl: string;
    term: "上" | "下" | "短";
    termStartDate: string;
    termYear: string;
    time: string;
    week: number;
    scoreTerm: string;
    scoreYear: string;
    score?: "上" | "下" | "短"; // 考虑一些服务与实际学期不同步
  };
  version: string;
  questionnaire: {
    path: string;
    state: "fold" | "close" | "open";
  };
}

export const useSystemStore = defineStore("system", () => {
  const loading = ref(false);
  const generalInfo = ref();
  const version = ref("");
  const questionnaire = ref<SystemStoreType["questionnaire"]>();

  const startLoading = () => {
    loading.value = true;
  };
  const stopLoading = () => {
    loading.value = false;
  };
  const setGeneralInfo = (value: SystemStoreType["generalInfo"]) => {
    generalInfo.value = value;
  };
  const setVersion = (value: string) => {
    version.value = value;
  };
  const setQuestionnaire = (value: SystemStoreType["questionnaire"]) => {
    questionnaire.value = value;
  };
  return {
    loading,
    generalInfo,
    version,
    questionnaire,
    startLoading,
    stopLoading,
    setGeneralInfo,
    setVersion,
    setQuestionnaire
  };
}, {
  persist: {
    storage: persistedStateStorage
  } });
