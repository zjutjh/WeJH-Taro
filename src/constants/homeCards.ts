export type HomeCardName =
  "lessons-table-quick-view" |
  "exam-quick-view" |
  "school-card-quick-view" |
  "score-quick-view" |
  "library-quick-view" |
  "electricity-quick-view";

export const homeCards: {
  [key in HomeCardName]: {
    name: key;
    label: string;
    icon: string;
    backgroundColor: string;
    require: "isBindZF" | "isBindLibrary" | "isBindYXY";
  }
} = {
  "exam-quick-view": {
    name: "exam-quick-view",
    label: "考试安排",
    icon: "exam",
    backgroundColor: "orange",
    require: "isBindZF"
  },
  "lessons-table-quick-view": {
    name: "lessons-table-quick-view",
    label: "课程表",
    icon: "lessonstable",
    backgroundColor: "blue",
    require: "isBindZF"
  },
  "library-quick-view": {
    name: "library-quick-view",
    label: "借阅信息",
    icon: "library",
    backgroundColor: "yellow",
    require: "isBindLibrary"
  },
  "school-card-quick-view": {
    name: "school-card-quick-view",
    label: "校园卡",
    icon: "schoolcard",
    backgroundColor: "green",
    require: "isBindYXY"
  },
  "score-quick-view": {
    name: "score-quick-view",
    label: "成绩绩点",
    icon: "score",
    backgroundColor: "green",
    require: "isBindZF"
  },
  "electricity-quick-view": {
    name: "electricity-quick-view",
    label: "电量查询",
    icon: "electricity",
    backgroundColor: "yellow",
    require: "isBindYXY"
  }
};
