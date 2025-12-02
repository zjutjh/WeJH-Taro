import { useQuery } from "@tanstack/vue-query";

import { QUERY_KEY } from "@/services/api/query-key";

const { data } = useQuery({
  queryKey: [QUERY_KEY.SCHOOLBUS_INFO]
});
