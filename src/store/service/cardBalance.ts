import { YxyService } from "@/services";
import { MPErrorCode, RequestError } from "@/utils";
import { useQuery } from "@tanstack/vue-query";

async function schoolCardBalanceFetcher() {
  const balance = await YxyService.querySchoolCardBalance();
  if (!Number.isFinite(+balance)) {
    throw new RequestError("无效余额值", MPErrorCode.MP_INVALID_DATA_VALUE);
  }

  return {
    balance,
    _upTime: Date.now()
  };
}

function useSchoolCardBalanceQuery() {
  return useQuery({
    queryKey: ["schoolCard/balance"],
    queryFn: schoolCardBalanceFetcher
  });
}

export default useSchoolCardBalanceQuery;
