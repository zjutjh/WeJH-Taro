import Taro from "@tarojs/taro";
import { useQuery } from "@tanstack/vue-query";

async function wxProfileFetcher() {
  const res = await Taro.getUserProfile({ desc: "用于获取头像和昵称" });
  return res.userInfo;
}

function useUserWxProfile() {
  const { data: profile, refetch: getProfile } = useQuery({
    queryKey: ["wxProfile"],
    queryFn: wxProfileFetcher,
    staleTime: Infinity,
    enabled: false
  });

  return {
    profile,
    getProfile
  };
};

export default useUserWxProfile;
