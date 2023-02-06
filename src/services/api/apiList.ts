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
      yxy: {
        getGraph: "/api/user/bind/yxy/get/captcha",
        sendGraphAuthCode: "/api/user/bind/yxy/send/captcha",
        login: "/api/user/bind/yxy/login",
      }
    }
  },
  card: {
    balance: "/api/func/card/balance",
    today: "/api/func/card/today",
    history: "/api/func/card/history"
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
  canteen: {
    flow: "/api/func/canteen/flow"
  },
  electricity: {
    balance: "/api/func/electricity/balance",
    record: "/api/func/electricity/record",
    consumption: "/api/func/electricity/consumption"
  },
  applist: "/api/applist",
  info: "/api/info",
  announcement: "/api/announcement"
};

const defDevHost = "http://0.0.0.0:8080";
function appendHost(api: Object) {
  for (const key in api)
    if (Object.prototype.hasOwnProperty.call(api, key))
      if (api[key] instanceof Object) appendHost(api[key]);
      else
        api[key] = process.env.HOST
          ? process.env.HOST + api[key]
          : defDevHost + api[key];
}

appendHost(api);
export { api };
