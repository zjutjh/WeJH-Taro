import { Ref } from "vue";
import { ZFService } from "@/services";
import { useQuery } from "@tanstack/vue-query";

async function lessonTableFetcher(opts: {
  year: string;
  term: string;
}) {
  const raw = await ZFService.getLessonTable({
    year: opts.year,
    term: opts.term
  });
  return {
    lessons: raw.lessonsTable,
    _upTime: Date.now()
  };
}

function useLessonTableQuery(options: {
  year: Ref<string> | string;
  term: Ref<string> | string;
}) {
  return useQuery({
    queryKey: ["lessonTable", options.year, options.term],
    queryFn: ({ queryKey }) => lessonTableFetcher({
      year: queryKey[1],
      term: queryKey[2]
    })
  });
}

export default useLessonTableQuery;
