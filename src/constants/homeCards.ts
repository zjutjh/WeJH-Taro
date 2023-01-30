export type HomeCardName =
  "lessons-table-quick-view" |
  "exam-quick-view" |
  "school-card-quick-view" |
  "score-quick-view" |
  "library-quick-view";

export const homeCards: {
  [key in HomeCardName]: {
    name: key;
    label: string;
    icon: string;
    backgroundColor: string;
  }
} = {
  "exam-quick-view": {
    name: "exam-quick-view",
    label: "考试安排",
    icon: "exam",
    backgroundColor: "orange"
  },
  "lessons-table-quick-view": {
    name: "lessons-table-quick-view",
    label: "课程表",
    icon: "lessonstable",
    backgroundColor: "blue"
  },
  "library-quick-view": {
    name: "library-quick-view",
    label: "借阅信息",
    icon: "library",
    backgroundColor: "yellow"
  },
  "school-card-quick-view": {
    name: "school-card-quick-view",
    label: "校园卡",
    icon: "schoolcard",
    backgroundColor: "green"
  },
  "score-quick-view": {
    name: "score-quick-view",
    label: "成绩查询",
    icon: "score",
    backgroundColor: "green"
  }
};
