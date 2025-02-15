import { YxyService } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { Ref } from "vue";

async function electricityBalanceFetcher(params: {
  campus: string
}) {
  const res = await YxyService.queryBalance(params);

  return {
    room: res.display_room_name,
    balance: res.soc,
    _upTime: Date().toString()
  };
}

function useElectricityBalanceQuery(props: {
  campus: Ref<string> | string;
}) {
  return useQuery({
    queryKey: ["electricity/balance", props.campus] as const,
    queryFn: ({ queryKey }) => electricityBalanceFetcher({
      campus: queryKey[1]
    })
  });
}

export default useElectricityBalanceQuery;
