const api = {
  user: {
    login: {
      wechat: "/api/user/login/wechat",
    },
    info: "/api/user/info",
  },
  card:{
    balance:"/api/func/card/balance",
    today:"/api/func/card/today",
    history:"/api/func/card/history"
  },
  applist:"/api/applist",
  announcement:"/api/announcement"
};
const defDevHost = "http://localhost:8080";

function appendHost(api: Object) {
  for (const key in api)
    if (Object.prototype.hasOwnProperty.call(api, key))
      if (api[key] instanceof Object) appendHost(api[key]);
      else
        api[key] = process.env.HOST ? process.env.HOST : defDevHost + api[key];
}

appendHost(api);
export { api };
