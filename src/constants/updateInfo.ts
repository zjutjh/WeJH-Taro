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
  version: "2.5.0",
  title: "微精弘更新公告",
  content: `微精弘小程序2.5.0更新 [失物招领] ，注册绑定一卡通以体验！
  > 更新内容
  1. 实验室上线切换主题色功能
  2. 微精弘 x “For You”工程 联合上线失物招领
  3. 校园资讯功能优化
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
