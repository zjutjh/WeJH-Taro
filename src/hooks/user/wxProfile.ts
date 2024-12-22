import Taro from "@tarojs/taro";
import useMemorizedRequest from "../useMemorizedRequest";

function useUserWxProfile() {
  const { data: profile, refresh: getProfile } = useMemorizedRequest(
    "user/wxProfile",
    () => Taro.getUserProfile({ desc: "用于获取头像和昵称" }).then(res => res.userInfo),
    {
      initialData: undefined,
      revalidateOnMount: false
    }
  );

  return {
    profile,
    getProfile
  };
}

export default useUserWxProfile;
