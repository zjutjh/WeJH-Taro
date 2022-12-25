import Taro from "@tarojs/taro";
import { cookiesToString, ICookie } from "./cookie";

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
      url: url,
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
  data: Object | null | undefined,
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
      url: url,
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

let fetch = {
  get: get,
  post: postJson
};

export { fetch, FetchResult };
