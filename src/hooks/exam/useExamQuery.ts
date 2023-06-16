import { ZFService } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { Ref } from "vue";

async function examsFetcher(opts: {
  year: string;
  term: "上" | "下" | "短"
}) {
  const res = await ZFService.getExamInfo(opts) ?? [];
  return {
    list: res,
    _upTime: Date.now()
  };
};

export default function useExamQuery(options: {
  year: Ref<string> | string;
  term: Ref<"上" | "下" | "短"> | "上" | "下" | "短";
}) {
  return useQuery({
    queryKey: ["exam", options.year, options.term] as const,
    queryFn: ({ queryKey }) => examsFetcher({
      year: queryKey[1],
      term: queryKey[2]
    })
  });
}
