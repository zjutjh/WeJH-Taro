import { SystemService } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

const INIT_DATA = {
  defaultTheme: { } as any,
  fileUrl: "",
  "is_begin": true,
  jpgUrl: "",
  registerTips: "",
  schoolBusUrl: "",
  scoreTerm: "上",
  scoreYear: "2024",
  term: "上",
  termStartDate: "2024-09-15",
  termYear: "2024",
  time: "",
  week: 1
} as const;

function useGeneralInfo() {
  const { data } = useQuery({
    queryKey: ["system", "generalInfo"],
    queryFn: SystemService.getGeneralInfo
  });

  const info = computed(() => {
    if (!data.value) {
      return INIT_DATA;
    } else {
      return data.value;
    }
  });

  return info;
}

export default useGeneralInfo;
