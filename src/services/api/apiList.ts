const api = {
  user: {
    login: {
      wechat: "/api/user/login/wechat",
      password: "/api/user/login"
    },
    create: {
      wechat: "/api/user/create/student/wechat",
      h5: "/api/user/create/student"
    },
    info: "/api/user/info",
    bind: {
      library: "/api/user/bind/library",
      zf: "/api/user/bind/zf",
      oauth: "/api/user/bind/oauth",
      yxy: {
        getGraph: "/api/user/bind/yxy/get/captcha",
        sendGraphAuthCode: "/api/user/bind/yxy/send/captcha",
        login: "/api/user/bind/yxy/login"
      }
    },
    theme: {
      get: "/api/func/theme/get",
      set: "/api/func/theme/choose"
    },
    logout: "/api/user/del",
    changePassword: "/api/user/repass"
  },
  card: {
    balance: "/api/func/card/balance",
    record: "/api/func/card/record"
  },
  library: {
    current: "/api/func/library/current",
    history: "/api/func/library/history"
  },
  zf: {
    lessonTable: "/api/func/zf/classtable",
    examInfo: "/api/func/zf/exam",
    scoreInfo: "/api/func/zf/score",
    midtermscoreInfo: "/api/func/zf/midtermscore",
    freeroom: "/api/func/zf/room"
  },
  electricity: {
    balance: "/api/func/electricity/balance",
    record: "/api/func/electricity/record",
    consumption: "/api/func/electricity/consumption",
    subscription: "/api/func/electricity/subscription"
  },
  lostfound: {
    record: "/api/func/lost",
    kind: "/api/func/lost/kind_list"
  },
  announcement: "/api/announcement",
  information: "/api/func/information",
  applist: "/api/applist",
  info: "/api/info",
  suit: {
    getFaq: "/api/func/supplies-borrow/qa",
    getInformation: "/api/func/supplies-borrow/info",
    changeInformation: "/api/func/supplies-borrow/info",
    check: "/api/func/supplies-borrow/supplies",
    submit: "/api/func/supplies-borrow/borrow",
    record: "/api/func/supplies-borrow/borrow"
  }
};

export { api };
