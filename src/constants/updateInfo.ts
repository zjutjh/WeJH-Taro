import Taro from "@tarojs/taro";

type UpdateInfoType = {
  version: string;
  title: string;
  content: string;
  actions?: {
    cancel: {
      label: string;
      callback?: () => void;
    },
    confirm: {
      label: string;
      callback?: () => void;
    }
  }
}

export const updateInfo: UpdateInfoType = {
  version: "2.5.2",
  title: "微精弘更新公告",
  content: `
  校级学生组织【精弘网络】研发的微精弘小程序更新啦！
  新功能「统一验证系统」与「实验室」全新主题色，等你来体验！
  > 更新内容
  1. 「公告栏」毅行问卷入口上线
  2. 「实验室」主题色功能新增 毅行特供紫色限定主题上线
  `,
  actions: {
    cancel: { label: "取消" },
    confirm: {
      label: "前往绑定",
      callback: () => {
        Taro.navigateTo({
          url: "/pages/bind/index?bind=yxy"
        });
      }
    }
  }
};

export const questionnaireInfo = {
  isAccess: false,
  appId: "wxd947200f82267e58",
  path: "pages/wjxqList/wjxqList?activityId=O5QdXK",
};
