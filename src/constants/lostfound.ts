import { CampusOption, LostOrFoundOption } from "@/api/types/lostfound";

export interface ContactMsg {
  data: Array<{ content: string; extra?: string }>;
  message: string;
}

export const CONTACT_MSG: ContactMsg = {
  data: [
    { content: "“For You”工程 朝晖校区 QQ: 2716709627" },
    { content: "“For You”工程 屏峰校区 QQ: 3252819828" },
    { content: "“For You”工程 莫干山校区 QQ: 3525146766" },
    {
      content: "学生事务大厅-朝晖: 综合楼一楼河畔旁",
      extra: "学生事务大厅-朝晖\r\n电话: 88320868"
    },
    {
      content: "学生事务大厅-屏峰: 西4和东15楼下",
      extra: "学生事务大厅-屏峰\r\n东15电话: 85290858\r\n西4电话:85290880"
    },
    {
      content: "学生事务大厅-莫干山: 德8德9连廊",
      extra: "学生事务大厅-莫干山\r\n电话: (0571) 8881 3551"
    }
  ],
  message: "点击查看相关业务服务组织的联系方式"
};

export interface Option<T = string> {
  key: string;
  label: T;
}

export const CAMPUS_OPTION_LIST: Option<CampusOption>[] = [
  { key: "屏峰", label: "屏峰" },
  { key: "朝晖", label: "朝晖" },
  { key: "莫干山", label: "莫干山" }
];

export const LOST_OR_FOUND_OPTION_LIST: Option<LostOrFoundOption>[] = [
  { key: "全部", label: "" },
  { key: "寻物", label: "寻物" },
  { key: "失物", label: "失物" }
];
