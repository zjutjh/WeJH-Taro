import { UserService } from "@/services";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export type WXProfileType = {
  avatarUrl: string;
  nickName: string;
};

export type UserInfoType = {
  createTime: string;
  id: number;
  phoneNum: string;
  studentID: string;
  username: string;
  userType: number;
};

export type BindStateType = {
  lib: boolean;
  yxy: boolean;
  zf: boolean;
  oauth: boolean;
};

function useUser() {
  const { data: info, refetch: fetchUserInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: UserService.getUserInfo,
    select: (res) => res.user
  });

  const { mutateAsync: logout } = useMutation({
    mutationFn: UserService.logout
  });

  const isActive = computed(() => info.value && "id" in info.value);

  return {
    info,
    isActive,
    fetchUserInfo,
    logout
  };
};

export default useUser;
