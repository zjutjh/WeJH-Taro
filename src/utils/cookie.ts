interface ICookie {
  Key: string;
  Value: string;
  Expires: Date;
  MaxAge: number;
}

/**
 * 把多个 cookie 字符串转换成 cookie 对象
 * 用于读取 cookie 的属性值
 * @param cookies cookie 数组
 * @returns
 */
function ejectCookies(cookies: string[]) {
  const sevCookies: ICookie[] = [];
  cookies.forEach((cookie) => {
    const keyValves = cookie.split(";");
    const ckie: ICookie = { Key: "", Value: "", Expires: new Date(), MaxAge: 0 };
    if (keyValves.length > 0) {
      keyValves.forEach((item) => {
        const [key, value] = item.split("=");
        if (key === "Expires") {
          ckie.Expires = new Date(value);
        } else if (key === "Max-Age") {
          ckie.MaxAge = parseInt(value);
        } else if (ckie.Key === "") {
          ckie.Key = key;
          ckie.Value = value;
        }
      });
      sevCookies.push(ckie);
    }
  });
  return sevCookies;
}

/**
 * 把对象数组转化成字符串
 * 在发送请求的时候
 * @param cookies cookie 对象数组
 * @returns
 */
function cookiesToString(cookies: ICookie[]) {
  let cookieString = "";
  cookies.forEach((cokie) => {
    cookieString += `${cokie.Key}=${cokie.Value};`;
  });
  return cookieString;
}

export { ICookie, ejectCookies, cookiesToString };
