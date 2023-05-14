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
  version: "2.3.0",
  title: "微精弘更新公告",
  content: `微精弘小程序更新[电费查询]，注册绑定一卡通以体验！
  > 更新内容
  1. 总电量查询
  2. 每日用电记录查询
  3. 电费缴费记录
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
