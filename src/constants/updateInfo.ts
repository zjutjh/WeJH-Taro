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
  version: "2.6.1",
  title: "微精弘更新公告",
  content: `微精弘小程序2.6.1更新 [正装借用] ！
  > 更新内容
  1. 微精弘 x “学生事务大厅” 联合上线正装借用功能
  2. 设置页面新增修改密码与注销功能
  3. 优化绑定页面的交互体验
  4. 修复了一些已知的bug
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
