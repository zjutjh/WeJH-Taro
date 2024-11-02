import { PermissionGroup } from "@/hooks/useBinding";

export type HomeCardName =
  "lessons-table-quick-view" |
  "exam-quick-view" |
  "school-card-quick-view" |
  "score-quick-view" |
  "library-quick-view" |
  "electricity-quick-view";

// TODO: 从配置平台获取首页卡片配置
export const homeCards: Record<HomeCardName, {
  name: HomeCardName;
  label: string;
  icon: string;
  backgroundColor: string;
  require: PermissionGroup;
}> = {
  "exam-quick-view": {
    name: "exam-quick-view",
    label: "考试安排",
    icon: "exam",
    backgroundColor: "orange",
    require: [["zf"], ["oauth"]]
  },
  "lessons-table-quick-view": {
    name: "lessons-table-quick-view",
    label: "课程表",
    icon: "lessonstable",
    backgroundColor: "blue",
    require: [["zf"], ["oauth"]]
  },
  "library-quick-view": {
    name: "library-quick-view",
    label: "借阅信息",
    icon: "library",
    backgroundColor: "yellow",
    require: [["lib"]]
  },
  "school-card-quick-view": {
    name: "school-card-quick-view",
    label: "校园卡",
    icon: "schoolcard",
    backgroundColor: "green",
    require: [["yxy"]]
  },
  "score-quick-view": {
    name: "score-quick-view",
    label: "成绩查询",
    icon: "score",
    backgroundColor: "green",
    require: [["zf"], ["oauth"]]
  },
  "electricity-quick-view": {
    name: "electricity-quick-view",
    label: "电费查询",
    icon: "electricity",
    backgroundColor: "yellow",
    require: [["yxy"]]
  }
};
