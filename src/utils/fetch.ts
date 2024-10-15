import Taro from "@tarojs/taro";
import { cookiesToString } from "./cookie";
import type { ICookie } from "./cookie";

interface FetchResult extends Taro.request.SuccessCallbackResult<any> {
  cookies?: string[];
}

function get(url: string, cookies?: ICookie[]): Promise<FetchResult> {
  const header = cookies
    ? {
      "Content-type": "application/json",
      Cookie: cookiesToString(cookies)
    }
    : {
      "Content-type": "application/json"
    };
  return new Promise((resolve, reject) => {
    Taro.request({
      url: process.env.HOST + url,
      header: header,
      mode: "cors",
      success: (res) => {
        resolve(res);
      },
      fail: (e) => {
        console.error(e);
        reject();
      }
    });
  });
}

function postJson(
  url: string,
  data: any,
  cookies?: ICookie[]
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const header = cookies
      ? {
        "Content-type": "application/json",
        Cookie: cookiesToString(cookies)
      }
      : {
        "Content-type": "application/json"
      };

    Taro.request({
      url: process.env.HOST + url,
      data: data ? data : undefined,
      header: header,
      method: "POST",
      mode: "cors",
      success: (res) => {
        resolve(res);
      },
      fail: (e) => {
        console.error(e);
        reject();
      }
    });
  });
}

const fetch = {
  get: get,
  post: postJson
};

export { fetch, FetchResult };
